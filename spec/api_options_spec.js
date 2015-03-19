/**
 * API Options Testing
 *
 * 1. Login
 * 2. Get OPTIONS
 * 6. Logout
 * 7. Fail Get OPTIONS
 */
var frisby = require('frisby');
var	util = require('../lib/util');
var	panax_config = require('../config/panax');
var querystring = require("querystring");

var	hostname = panax_config.ui.hostname,
	port = panax_config.ui.port,
	url = 'http://' + hostname + ':' + port;

// Global session cookie to be passed with each request
var session_cookie;

/**
 * Login Entrypoint
 */
frisby.create('Login')
	.post(url + '/api/session/login', {
		username: panax_config.ui.username,
		password: util.md5(panax_config.ui.password)
	})
	.expectStatus(200)
	.after(get_options)
.toss();

/**
 * Test Get OPTIONS
 * (when logged in)
 */
function get_options(err, res, body) {

	// ToDo: Should be stateless: https://github.com/vlucas/frisby/issues/36
	// Grab returned session cookie
    session_cookie = res.headers['set-cookie'][0].split(';')[0];

	var query = querystring.stringify({
		gui: 'ng',
		catalogName: "dbo.Sexo",
		valueColumn: "Clave",
		textColumn: "Pais"
	})

	frisby.create('Get OPTIONS')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/options?' + query)
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: "options",
			gui: "ng"
		})
		.expectJSONTypes({
			data: Array
		})
		.after(logout)
	.toss()
}

/**
 * Logout
 */
function logout(err, res, body) {
	frisby.create('Logout')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/session/logout')
		.expectStatus(200)
		.after(fail_options)
	.toss();
}

/**
 * Test Fail Get OPTIONS of existing entity
 * (when logged out)
 */
function fail_options(err, res, body) {
	frisby.create('Fail Get OPTIONS of existing entity')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/options?catalogName=dbo.Sexo')
		.expectStatus(401)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: false
		})
	.toss();
}