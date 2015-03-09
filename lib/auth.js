/**
 * Authtentication middleware
 * Passport-like logic
 *
 * http://passportjs.org/
 * http://danialk.github.io/blog/2013/02/20/simple-authentication-in-nodejs/
 */
var Panax = require('../lib/Panax');

/**
 * Authanticate in PanaxDB
 */
exports.authenticate = function(username, password, callback) {
	if (!username || !password)
		return callback({ message: "Error: Missing credentials" });

	var oPanax = new Panax();

	oPanax.authenticate(username, password, function(err, userId) {
		if (err)
			return callback(err);

		return callback(null, userId);
	});
};

/**
 * Required Authenticattion Middleware
 */
exports.requiredAuth = function(req, res, next) {
	if (!req.session.userId)
		return next({status: 401, message: "Not logged in"});

	next();
};