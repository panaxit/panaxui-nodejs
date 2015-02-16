var path = require('path');

/**
 * PanaxDB
 */
exports.db = {
	version: '<PANAXDB_VER>',
	server: '<HOSTNAME>',
	database: '<DB_NAME>',
	user: '<USERNAME>',
	password: '<PASSWORD>'
};

/**
 * PanaxUI
 */
exports.ui = {

	hostname: '<HOSTNAME>',
	port: <PORT>,
	username: '<USERNAME>',
	password: '<PASSWORD>',

	enabled_guis: [ 
		'extjs' // First GUI is the default
	],

	guis: {
		// Ext JS 5
		extjs: {
			root: path.join(__dirname, '..', '..', 'panaxui-extjs'),
			cache: path.join(__dirname, '..', '..', 'panaxui-extjs', 'cache', 'app')
		}
	}
};