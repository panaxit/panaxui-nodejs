var express = require('express');
var router = express.Router();
var PanaxDB = require('../lib/PanaxDB');

var libxslt = require('libxslt');
var util = require('../lib/util.js');

module.exports = router;

/**
 * POST /api/session/login
 */
router.post('/login', function login(req, res, next) {
	if (!req.body.username)
		return next({message: "Error: Missing username"});
	if (!req.body.password)
		return next({message: "Error: Missing password"});

	var oPanaxDB = new PanaxDB();

	new PanaxDB().authenticate(req.body.username, util.md5(req.body.password), function (err, userId) {
		if (err)
			return next(err);

		req.session.userId = userId;

		res.json({
			success: true,
			action: 'login',
			data: {
				userId: userId
			}
		});
	});
});

/**
 * GET /api/session/sitemap
 */
router.get('/sitemap', function sitemap(req, res, next) {
	if (!req.session.userId)
		return next({message: "Error: Not logged in"});

	var oPanaxDB = new PanaxDB(req.session);

	oPanaxDB.getSitemap(function (err, xml) {
		if(err)
			return next(err);

		libxslt.parseFile('xsl/sitemap.xsl', function (err, stylesheet) {
			if (err)
				return next(err);

			stylesheet.apply(xml, function (err, result) {
				if (err)
					return next(err);
				
				try {
					res.json({
						success: true,
						action: "sitemap",
						data: JSON.parse(util.sanitizeJSONString(result))
					});
				} catch (e) {
					return next({
						message: '[Server Exception] ' + e.name + ': ' + e.message,
						stack: e.stack
					});
				}
			});
		});
	});
});

/**
 * GET /api/session/logout
 */
router.get('/logout', function logout(req, res) {
	req.session.userId = null; // ToDo: session = null ?

	res.json({
		success: true,
		action: 'logout'
	});
});