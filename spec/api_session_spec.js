/**
 * API Session Tests
 */

var frisby = require('frisby');
var	panaxui = require('../../panaxui');

var	hostname = panaxui.config.hostname,
	port = panaxui.config.port,
	url = 'http://' + hostname + ':' + port;

var session_cookie;

/**
 * Test Login
 */
frisby.create('Login')
	.post(url + '/api/login', {
		username: panaxui.config.username,
		password: panaxui.config.password
	})
	.expectStatus(200)
	.expectHeaderContains('content-type', 'application/json')
	.expectJSON({
		success: true,
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
	.after(get_sitemap) // Chain tests (sync http requests)
.toss();	

/**
 * Test Get Sitemap (when logged in)
 */
function get_sitemap(err, res, body) {

	// ToDo: Should be stateless: https://github.com/vlucas/frisby/issues/36
	// Grab returned session cookie
    session_cookie = res.headers['set-cookie'][0].split(';')[0];

	frisby.create('Get Sitemap')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/sitemap')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true
		})
		.expectJSONLength('data', function (val) {
			expect(val).toBeGreaterThan(0); // Custom matcher callback
		})
		.expectJSONTypes({
			success: Boolean,
			data: Array
		})
		.after(read_entity) // Chain tests (sync http requests)
	.toss()
}

/**
 * Test Read Entity (when logged in)
 */
function read_entity(err, res, body) {

	frisby.create('Read Entity')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/read?catalogName=dbo.Empleado')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true
		})
		.expectJSONTypes({
			success: Boolean
		})
		.after(logout) // Chain tests (sync http requests)
	.toss()
}

/**
 * Test Read Entity Data (when logged in)
 * ToDo
 */

/**
 * Test Logout
 */
function logout(err, res, body) {
	frisby.create('Logout')
		.get(url + '/api/logout')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true
		})
		.expectJSONTypes({
			success: Boolean
		})
		.after(fail_sitemap) // Chain tests (sync http requests)
	.toss();
}

/**
 * Test Fail Read Entity (when logged out)
 * ToDo
 */

/**
 * Test Fail Sitemap (when logged out)
 */

function fail_sitemap(err, res, body) {
	frisby.create('Fail Sitemap')
		.get(url + '/api/sitemap')
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