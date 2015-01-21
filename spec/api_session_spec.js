/**
 * API Session Testing
 *
 * Timing Scenario:
 *
 * Login
 * 		Get Sitemap
 * 		Create Entity
 * 		Read Data
 * Logout
 * 		Fail Read Data
 * 		Fail Get Sitemap
 * 		
 */
var frisby = require('frisby');
var	panaxui = require('../panaxui');
var	util = require('../util');

var	hostname = panaxui.config.hostname,
	port = panaxui.config.port,
	url = 'http://' + hostname + ':' + port;

/**
 * Before All
 */
// Remove previous generated files
util.deleteFolderRecursive("cache");
// Global session cookie to be passed with each request
var session_cookie;

/**
 * Test Login
 * (when logged out)
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
 * Test Get Sitemap
 * (when logged in)
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
		.after(create_entity) // Chain tests (sync http requests)
	.toss()
}

/**
 * Test Create Entity @ first call
 * (when logged in)
 */
function create_entity(err, res, body) {

	frisby.create('Create Entity @ first call')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/read?catalogName=dbo.Empleado')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: "rebuild"
		})
		.expectJSONTypes({
			success: Boolean,
			action: String
			//catalog // ToDo: Special catalog verification?
		})
		.after(read_data) // Chain tests (sync http requests)
	.toss()
}

/**
 * Test Read Data of existing entity
 * (when logged in)
 */
function read_data(err, res, body) {

	frisby.create('Read Data of existing entity')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/read?catalogName=dbo.Empleado')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: "data"
		})
		.expectJSONTypes({
			success: Boolean,
			action: String
			// ToDo: Extra keys verification?
			//total:
			//catalog
			//metadata:
			//data
		})
		.after(logout) // Chain tests (sync http requests)
	.toss()
}

/**
 * Test Logout
 * (when logged in)
 */
function logout(err, res, body) {
	frisby.create('Logout')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/logout')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true
		})
		.expectJSONTypes({
			success: Boolean
		})
		.after(fail_read) // Chain tests (sync http requests)
	.toss();
}

/**
 * Test Fail Read Data of existing entity
 * (when logged out)
 * ToDo
 */
function fail_read(err, res, body) {
	frisby.create('Fail Read Data of existing entity')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/read?catalogName=dbo.Empleado')
		.expectStatus(500)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: false
		})
		.expectJSONTypes({
			success: Boolean
		})
		.after(fail_sitemap) // Chain tests (sync http requests)
	.toss();
}

/**
 * Test Fail Get Sitemap
 * (when logged out)
 */
function fail_sitemap(err, res, body) {
	frisby.create('Fail Get Sitemap')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
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