var path = require('path');

/**
 * PanaxDB
 */
exports.db = {

	config: {
		server: '<HOSTNAME>',
		database: '<DB_NAME>',
		user: '<USERNAME>',
		password: '<PASSWORD>'
	}

};

/**
 * PanaxUI
 */
exports.ui = {

	config: {
		hostname: '<HOSTNAME>',
		port: <PORT>,
		username: '<USERNAME>',
		password: '<PASSWORD>'
	},

	enabled_guis: [ 
		'extjs'
	],

	guis: {
		// Ext JS 5
		extjs: {
			root: path.join(__dirname, '..', 'panaxui-extjs')
		}
	}
};