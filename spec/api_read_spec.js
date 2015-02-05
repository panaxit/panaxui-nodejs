/**
 * API Read Testing
 *
 * 1. Login
 * 2. Read JSON DATA
 * 3. Read HTML FileTemplate
 * 5. ToDo: Read HTML DATA
 * 6. Logout
 * 7. Fail Read DATA
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
		password: panax_config.ui.password
	})
	.expectStatus(200)
	.after(read_json_data)
.toss();

/**
 * Test Read JSON DATA
 * (when logged in)
 */
function read_json_data(err, res, body) {

	// ToDo: Should be stateless: https://github.com/vlucas/frisby/issues/36
	// Grab returned session cookie
    session_cookie = res.headers['set-cookie'][0].split(';')[0];

	var query = querystring.stringify({
		catalogName: "dbo.Empleado",
		filters: "'id=1'",
		output: "json"
	})

	frisby.create('Read JSON DATA')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/read?' + query)
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			total: "1",
			success: true,
			action: "data",
			catalog: {
				dbId: panax_config.db.database,
				catalogName: 'dbo.Empleado'
				//mode:
				//controlType:
				//lang:
			}
		})
		.expectJSONLength('data', function (val) {
			expect(val).toBe(1); // Custom matcher callback
		})
		.expectJSONTypes({
			success: Boolean,
			action: String,
			catalog: {
				dbId: String,
				catalogName: String,
				//mode: String,
				//controlType: String,
				//lang: String
			},
			data: Array
			//metadata:
		})
		.after(read_html_filetemplate)
	.toss()
}

/**
 * Test Read HTML FileTemplate
 * (when logged in)
 */
function read_html_filetemplate(err, res, body) {

	var query = querystring.stringify({
		catalogName: "dbo.Empleado",
		controlType: "fileTemplate",
		filters: "'id=1'",
		output: "html"
	})

	frisby.create('Read HTML FileTemplate')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/read?' + query)
		.expectStatus(200)
		.expectHeaderContains('content-type', 'text/html')
		.after(logout)
	.toss()
}

/**
 * ToDo: Test Read HTML DATA (html.xsl)
 * (when logged in)
 */

/**
 * Logout
 */
function logout(err, res, body) {
	frisby.create('Logout')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/session/logout')
		.expectStatus(200)
		.after(fail_read)
	.toss();
}

/**
 * Test Fail Read DATA of existing entity
 * (when logged out)
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
	.toss();
}