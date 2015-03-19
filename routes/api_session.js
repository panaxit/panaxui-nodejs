var express = require('express');
var router = express.Router();
var libxslt = require('libxslt');
var Panax = require('panaxjs');
var config = require('../config/panax.js');

var util = require('../lib/util.js');
var auth = require('../lib/auth.js');

module.exports = router;

/**
 * POST /api/session/login
 */
router.post('/login', function login(req, res, next) {
	auth.authenticate(req.body.username, req.body.password, function (err, userId) {
		if (err) {
			err.status = 401;
			return next(err);
		}

		var oPanax = new Panax(config);

		oPanax.getVendorInfo(function (err, vendor) {
			if(err)
				return next(err);

			req.session.regenerate(function() {

				req.session.userId = userId;
				req.session.username = req.body.username;
				req.session.api_version = '0.0.1'; // ToDo: Centralized version number
				req.session.db = {
					server: config.db.server,
					vendor: vendor.version,
					version: config.db.version,
					database: config.db.database,
					user: config.db.user
				};

				res.json({
					success: true,
					action: 'login',
					data: req.session
				});
			});
		});
	});
});

/**
 * GET /api/session/info
 */
router.get('/info', auth.requiredAuth, function sitemap(req, res, next) {
	res.json({
		success: true,
		action: 'info',
		data: req.session
	});
});
/**
 * GET /api/session/sitemap
 */
router.get('/sitemap', auth.requiredAuth, function sitemap(req, res, next) {

	req.query.gui = (req.query.gui || config.ui.enabled_guis[0]).toLowerCase(); // Default GUI
	if (config.ui.enabled_guis.indexOf(req.query.gui) === -1)
		return next({ message: "Unsupported GUI '" + req.query.gui + "'." +
				"Available: " + config.ui.enabled_guis.toString().split(',').join(', ') });

	/**
	 * PanaxJS
	 */
	var oPanax = new Panax(config, req.session); // get userId

	oPanax.getSitemap(function (err, xml) {
		if(err)
			return next(err);

		libxslt.parseFile('xsl/' + req.query.gui + '/sitemap.xsl', function (err, stylesheet) {
			if (err)
				return next(err);

			stylesheet.apply(xml, function (err, result) {
				if (err)
					return next(err);
				
				try {
					res.json({
						success: true,
						action: "sitemap",
						gui: req.query.gui,
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
	req.session.destroy(function(err) {
		if(err)
			return next(err);

		res.json({
			success: true,
			action: 'logout'
		});
	})
});