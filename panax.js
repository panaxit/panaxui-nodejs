var path = require('path');

/**
 * PanaxDB
 */
exports.db = {

	config: {
		server: 'localhost',
		database: 'Showcase',
		user: 'sa',
		password: 'zama'
	}

};

/**
 * PanaxUI
 */
exports.ui = {

	config: {
		hostname: 'localhost',
		port: 3000,
		username: 'webmaster',
		password: 'tests'
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