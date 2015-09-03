/**
 * Authtentication middleware
 * Passport-like logic
 *
 * http://passportjs.org/
 * http://danialk.github.io/blog/2013/02/20/simple-authentication-in-nodejs/
 */
var PanaxJS = require('panaxjs');
var panax_config = require('../config/panax.js');

/**
 * Authanticate in PanaxDB
 */
exports.authenticate = function(username, password, instance, callback) {
	if (!username || !password)
		return callback({ message: "Error: Missing credentials" });

	instance = instance || panax_config.default_instance;

	/**
	 * PanaxJS
	 */
	var panaxdb = new PanaxJS.Connection(panax_config.instances[instance]);

	panaxdb.authenticate(username, password, function(err, userId) {
		if (err)
			return callback(err);

		return callback(null, userId);
	});
};

/**
 * Required Authenticattion Middleware
 */
exports.requiredAuth = function(req, res, next) {
	if (!req.session.userId) {
		var instances = [panax_config.default_instance];
		for(var name in panax_config.instances) {
			if(name !== panax_config.default_instance)
				instances.push(name);
		}
		return next({
			status: 401, 
			message: "Not logged in", 
			data: {
				instances: instances
			}
		});
	}

	next();
};