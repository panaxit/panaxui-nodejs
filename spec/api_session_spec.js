/**
 * API Session Testing
 *
 * 1. Login
 * 2. Get Sitemap
 * 3. Logout
 * 4. Fail Sitemap
 */
var frisby = require('frisby');
var	panax_config = require('../config/panax');
var util = require('../lib/util.js');

var	hostname = panax_config.ui.hostname,
	port = panax_config.ui.port,
	url = 'http://' + hostname + ':' + port;

// Global session cookie to be passed with each request
var session_cookie;

/**
 * Test Fail Login
 * (when logged out)
 * Chained Tests Entrypoint
 */
frisby.create('Fail Login')
	.post(url + '/api/session/login', {
		username: panax_config.ui.username,
		password: 'wrong'
	})
	.expectStatus(401)
	.expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		success: false
	})
	.after(login)
.toss();

/**
 * Test Login
 * (when logged out)
 */
function login(err, res, body) {
	frisby.create('Login')
		.post(url + '/api/session/login', {
			username: panax_config.ui.username,
			password: util.md5(panax_config.ui.password)
		})
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: 'login'
		})
		.after(get_info)
	.toss()
}

/**
 * Test Get Info
 * (when logged in)
 */
function get_info(err, res, body) {
	// ToDo: Should be stateless: https://github.com/vlucas/frisby/issues/36
	// Grab returned session cookie
  session_cookie = res.headers['set-cookie'][0].split(';')[0];

	frisby.create('Get Info')
	  .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/session/info')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: 'info',
			data: {
				username: panax_config.ui.username,
				api_version: '0.0.1',
				db: {
					server: panax_config.db.server,
					vendor: 'SQL Server 2012 11.0.5058',
					version: panax_config.db.version,
					database: panax_config.db.database,
					user: panax_config.db.user
				}
			}
		})
		.after(get_sitemap)
	.toss()
}

/**
 * Test Get Sitemap
 * (when logged in)
 */
function get_sitemap(err, res, body) {
	frisby.create('Get Sitemap')
	  .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/session/sitemap')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: 'sitemap',
			gui: 'extjs'
		})
		.expectJSONLength('data', function (val) {
			expect(val).toBeGreaterThan(0); // Custom matcher callback
		})
		.expectJSONTypes({
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
		.after(fail_sitemap)
	.toss();
}

/**
 * Test Fail Get Info
 * (when logged out)
 */
function fail_info(err, res, body) {
	frisby.create('Fail Get Info')
	  .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/session/info')
		.expectStatus(401)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: false
		})
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
		.expectStatus(401)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: false
		})
	.toss();
}
