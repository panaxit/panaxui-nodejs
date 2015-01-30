/**
 * API Session Testing
 *
 * 1. Login
 * 2. Get Sitemap
 * 3. Logout
 * 4. Fail Sitemap
 */
var frisby = require('frisby');
var	panaxui = require('../panaxui');

var	hostname = panaxui.config.hostname,
	port = panaxui.config.port,
	url = 'http://' + hostname + ':' + port;

// Global session cookie to be passed with each request
var session_cookie;

/**
 * Test Login
 * (when logged out)
 * Chained Tests Entrypoint
 */
frisby.create('Login')
	.post(url + '/api/session/login', {
		username: panaxui.config.username,
		password: panaxui.config.password
	})
	.expectStatus(200)
	.expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		success: true,
		action: 'login',
		// data: {
		// 	userId: //ToDo: Special userId verification?
		// }
	})
	.expectJSONTypes({
		success: Boolean,
		data: {
			userId: String
		}
	})
	.after(get_sitemap)
.toss();

/**
 * Test Get Sitemap
 * (when logged in)
 */
function get_sitemap(err, res, body) {

	// ToDo: Should be stateless: https://github.com/vlucas/frisby/issues/36
	// Grab returned session cookie
    session_cookie = res.headers['set-cookie'][0].split(';')[0];

	frisby.create('Get Sitemap')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/session/sitemap')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true
			//ToDo: action: 'sitemap'
		})
		.expectJSONLength('data', function (val) {
			expect(val).toBeGreaterThan(0); // Custom matcher callback
		})
		.expectJSONTypes({
			success: Boolean,
			data: Array
		})
		.after(logout)
	.toss()
}

/**
 * Test Logout
 * (when logged in)
 */
function logout(err, res, body) {
	frisby.create('Logout')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/session/logout')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: 'logout'
		})
		.expectJSONTypes({
			success: Boolean
		})
		.after(fail_sitemap)
	.toss();
}

/**
 * Test Fail Get Sitemap
 * (when logged out)
 */
function fail_sitemap(err, res, body) {
	frisby.create('Fail Get Sitemap')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/session/sitemap')
		.expectStatus(500)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: false
		})
		.expectJSONTypes({
			success: Boolean
		})
	.toss();
}