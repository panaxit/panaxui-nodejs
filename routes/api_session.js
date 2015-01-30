var express = require('express');
var router = express.Router();
var sql = require('mssql');
var panax = require('../panax.js');

var libxslt = require('libxslt');

var util = require('../util.js');

module.exports = router;

/**
 * POST /api/session/login
 */
router.post('/login', function login(req, res, next) {
	if (!req.body.username)
		return next({message: "Error: Missing username"});
	if (!req.body.password)
		return next({message: "Error: Missing password"});

	sql.connect(panax.db.config, function (err) {
		if (err)
			return next(err);

		var sql_req = new sql.Request();

		sql_req.input('username', sql.VarChar, req.body.username);
		sql_req.input('password', sql.VarChar, util.md5(req.body.password));

		sql_req.execute('[$Security].Authenticate', function (err, recordsets, returnValue) {
			if (err)
				return next(err);

			req.session.userId = recordsets[0][0].userId;
			//ToDo: oCn.execute "IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES IST WHERE routine_schema IN ('$Application') AND ROUTINE_NAME IN ('OnStartUp')) BEGIN EXEC [$Application].OnStartUp END"
			//ToDo: sqlRequest.query("...", function (err, recordset) {...

			res.json({
				success: true,
				action: 'login',
				data: {
					userId: req.session.userId
				}
			});
		});
	});
});

/**
 * GET /api/session/logout
 */
router.get('/logout', function logout(req, res) {
	req.session.userId = null;
	req.session.usersitemap = null;

	res.json({
		success: true,
		action: 'logout'
	});
});

/**
 * GET /api/session/sitemap
 */
router.get('/sitemap', function sitemap(req, res, next) {
	if (!req.session.userId)
		return next({message: "Error: Not logged in"});

	sql.connect(panax.db.config, function (err) {
		if (err)
			return next(err);

		var sql_req = new sql.Request();

		sql_req.query("[$Security].UserSitemap @@IdUser=" + req.session.userId, function (err, recordset) {
			if (err)
				return next(err);

			libxslt.parseFile('xsl/sitemap.xsl', function (err, stylesheet) {
				if (err)
					return next(err);

				stylesheet.apply(recordset[0][''], function (err, result) {
					if (err) {
						return next(err);
					}

					res.json(JSON.parse(util.sanitizeJSONString(result)));
				});
			});
		});
	});
});