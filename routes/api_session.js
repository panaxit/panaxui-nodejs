var express = require('express');
var router = express.Router();
var libxslt = require('libxslt');
var PanaxJS = require('panaxjs');
var panax_config = require('../config/panax.js');

var util = require('../lib/util.js');
var auth = require('../lib/auth.js');

module.exports = router;

/**
 * POST /api/session/login
 */
router.post('/login', function login(req, res, next) {
	auth.authenticate(req.body.username, req.body.password, req.body.instance, function (err, userId) {
		if (err) {
			err.status = 401;
			return next(err);
		}

		// Set default instance as SINGLETON
		panax_config.default_instance = req.body.instance || panax_config.default_instance;
		var panax_instance = panax_config.instances[panax_config.default_instance];
		var panaxdb = new PanaxJS.Connection(panax_instance);

		panaxdb.getInfo(function (err, info) {
			if(err)
				return next(err);

			req.session.regenerate(function() {

				req.session.panax_instance = panax_config.default_instance;
				req.session.userId = userId;
				req.session.username = req.body.username;
				req.session.api_version = '0.0.1'; // ToDo: Centralized version number
				req.session.node_version = process.version;
				req.session.db = {
					server: panax_instance.db.server,
					vendor: info.vendor_ver,
					panaxdb: info.panaxdb_ver,
					version: panax_instance.db.version,
					database: panax_instance.db.database,
					user: panax_instance.db.user
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

	req.query.gui = (req.query.gui || panax_config.enabled_guis[0]).toLowerCase(); // Default GUI
	if (panax_config.enabled_guis.indexOf(req.query.gui) === -1)
		return next({ message: "Unsupported GUI '" + req.query.gui + "'." +
				"Available: " + panax_config.enabled_guis.toString().split(',').join(', ') });

	/**
	 * PanaxJS
	 */
	var panaxdb = new PanaxJS.Connection(panax_config.instances[panax_config.default_instance], req.session); // get userId

	panaxdb.getSitemap(function (err, xml) {
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
						stack: e.stack,
						result: result.replace(/\n/g, '').replace(/\t/g, '')
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

		var instances = [panax_config.default_instance];
		for(var name in panax_config.instances) {
			if(name !== panax_config.default_instance)
				instances.push(name);
		}
		res.json({
			success: true,
			action: 'logout',
			data: {
				instances: instances
			}
		});
	})
});