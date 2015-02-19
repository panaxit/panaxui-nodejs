var express = require('express');
var router = express.Router();
var PanaxDB = require('../lib/PanaxDB');

var passport = require('passport');

var libxslt = require('libxslt');
var util = require('../lib/util.js');

var config = require('../config/panax.js');

module.exports = router;

/**
 * POST /api/session/login
 * http://passportjs.org/guide/login/
 */
router.get('/login', function login(req, res, next) {

	passport.authenticate('local', function (err, user, info) {
		if (err)
			return next(err);
		if (!user)
			return next({message: "Error: Wrong credentials"});

		return res.json({
			success: true,
			action: 'login',
			data: {
				userId: user
			}
		});
		// req.login(user, function (err) {
		// 	if (err)
		// 		return next(err);

		// 	return res.json({
		// 		success: true,
		// 		action: 'login',
		// 		data: {
		// 			userId: user
		// 		}
		// 	});
		// });
	})(req, res, next);
	// if (!req.body.username)
	// 	return next({message: "Error: Missing username"});
	// if (!req.body.password)
	// 	return next({message: "Error: Missing password"});

	// var oPanaxDB = new PanaxDB();

	// oPanaxDB.authenticate(req.body.username, req.body.password, function (err, userId) {
	// 	if (err)
	// 		return next(err);

	// 	req.session.userId = userId;

	// 	res.json({
	// 		success: true,
	// 		action: 'login',
	// 		data: {
	// 			userId: userId
	// 		}
	// 	});
	// });
});

/**
 * GET /api/session/logout
 */
router.get('/logout', function logout(req, res) {

	req.logout();

	res.json({
		success: true,
		action: 'logout'
	});
	// req.session.destroy(function(err) {
	// 	if(err)
	// 		return next(err);

	// 	res.json({
	// 		success: true,
	// 		action: 'logout'
	// 	});
	// })
});

/**
 * GET /api/session/sitemap
 */
router.get('/sitemap', passport.authenticate('local'), function (req, res, next) {

	console.log('### ENTER SITEMAP: '+req.user)
	req.query.gui = (req.query.gui || config.ui.enabled_guis[0]).toLowerCase(); // Default GUI
	if (config.ui.enabled_guis.indexOf(req.query.gui) === -1)
		return next({ message: "Error: Unsupported GUI '" + req.query.gui + "'." +
				"Available: " + config.ui.enabled_guis.toString().split(',').join(', ') });

	var oPanaxDB = new PanaxDB(req.session);

	oPanaxDB.getSitemap(function (err, xml) {
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