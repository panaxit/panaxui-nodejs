var express = require('express');
var router = express.Router();

var sql = require('mssql');
var panaxdb = require('../panaxdb.js');
var panaxui = require('../panaxui.js');

/* GET API descriptor */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'PanaxUI API' });
});

/* POST login */
router.post(panaxui.api.login, function login(req, res, next) {

	/* Connect to MSSQL */
	sql.connect(panaxdb.config, function (err) {

		/* Error handling */
		if (err) {
			return next(err);
		}
		if (!req.body.username || !req.body.password) {
			return next({message: "Error: Not logged in"});
		}

		/* SQL Request */
		var sql_req = new sql.Request();
		sql_req.input('username', sql.VarChar, req.body.username);
		sql_req.input('password', sql.VarChar, panaxui.md5(req.body.password));
		sql_req.execute('[$Security].Authenticate', function (err, recordsets, returnValue) {

			/* Error handling for SQL Request */
			if (err) {
				return next(err);
			}

console.dir(panaxui.config.username)
console.dir(panaxui.config.password)
console.dir(recordsets)
			/* Set session data */
			req.session.userId = recordsets[0][0].userId;
			
			//ToDo: oCn.execute "IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES IST WHERE routine_schema IN ('$Application') AND ROUTINE_NAME IN ('OnStartUp')) BEGIN EXEC [$Application].OnStartUp END"
			//sqlRequest.query("...", function (err, recordset) {...

			/* JSON Response */
			res.json({
				success: true,
				data: {
					userId: req.session.userId
				}
			});
		});
	});
});

/* GET logout */
router.get(panaxui.api.logout, function login(req, res) {

	/* Clear session */
	req.session.userId = null;
	req.session.usersitemap = null;

	/* JSON Response */
	res.json({
		success: true
	});
});

module.exports = router;
