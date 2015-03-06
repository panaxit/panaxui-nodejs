var path = require('path');

console.log('\n');
console.log(" ____                        _   _ ___ ");
console.log("|  _ \\ __ _ _ __   __ ___  _| | | |_ _|");
console.log("| |_) / _` | '_ \\ / _` \\ \\/ / | | || | ");
console.log("|  __/ (_| | | | | (_| |>  <| |_| || | ");
console.log("|_|   \\__,_|_| |_|\\__,_/_/\\_\\\\___/|___|");

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

console.log('\n\n');
console.log('DB Config');
console.log('\n');
console.dir(exports.db);

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
		extjs: { // Match GUI name in enabled_guis
			root: path.join(__dirname, '..', '..', 'panaxui-extjs'), // application's root location
			cache: path.join(__dirname, '..', '..', 'panaxui-extjs', 'cache', 'app'), // building cache location
			other: [{ //other static asset's locations
				url: '/some_place',
				path: path.join(__dirname, '..', '..', 'somewhere', 'else'),
			}]
		}
	}
};

console.log('\n\n');
console.log('UI Config');
console.log('\n');
console.dir(exports.ui);