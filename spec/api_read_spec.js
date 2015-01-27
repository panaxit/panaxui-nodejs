/**
 * API Read Testing
 *
 * 1. Login
 * 2. Read JSON DATA
 * 3. Read HTML Data
 * 4. Read HTML with FileTemplate
 * 5. Logout
 * 6. Fail Read Data
 */
var frisby = require('frisby');
var	util = require('../util');
var	panaxui = require('../panaxui');
var	panaxdb = require('../panaxdb');

var	hostname = panaxui.config.hostname,
	port = panaxui.config.port,
	url = 'http://' + hostname + ':' + port;

// Global session cookie to be passed with each request
var session_cookie;

/**
 * Login Entrypoint
 */
frisby.create('Login')
	.post(url + '/api/login', {
		username: panaxui.config.username,
		password: panaxui.config.password
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

	frisby.create('Read JSON DATA')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/read?catalogName=dbo.Empleado&ouput=json')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: "data",
			catalog: {
				dbId: panaxdb.config.database,
				catalogName: 'dbo.Empleado'
				//mode:
				//controlType:
				//lang:
			}
		})
		//.expectJSONLength('data', 1) ToDo: Test Data length > 0
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
			// ToDo: Extra keys verification?
			//total:
			//metadata:
		})
		.after(read_html_filetemplate_data)
	.toss()
}

/**
 * Test Read HTML DATA (html.xsl)
 * (when logged in)
 */
// ToDo

/**
 * Test Read HTML with FileTemplate (using node-pate)
 * (when logged in)
 */
function read_html_filetemplate_data(err, res, body) {

	frisby.create('Read HTML with FileTemplate (using node-pate)')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/read?catalogName=dbo.Empleado&controlType=fileTemplate&ouput=html')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'text/html')
		.after(logout)
	.toss()
}

/**
 * Logout
 */
function logout(err, res, body) {
	frisby.create('Logout')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/logout')
		.expectStatus(200)
		.after(fail_read)
	.toss();
}

/**
 * Test Fail Read Data of existing entity
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