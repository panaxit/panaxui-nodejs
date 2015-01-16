/**
 * PanaxUI config
 */
exports.config = {
	hostname: 'localhost',
	port: 3000,
	username: 'webmaster',
	password: 'tests'
};

exports.api = {
	login: '/login',
	logout: '/login',
	sitemap: '/sitemap'
};

var crypto = require('crypto');

exports.md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}