/**
 * API Read AngularJS Testing
 *
 * 1. Login
 * 2. Read gridView/readonly JSON DATA
 * 2. Read formView/readonly JSON DATA
 * 6. Logout
 * 7. Fail Read JSON DATA
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
	.after(gridview_readonly)
.toss();

/**
 * Test Read gridView/readonly
 * (when logged in)
 */
function gridview_readonly(err, res, body) {

	// ToDo: Should be stateless: https://github.com/vlucas/frisby/issues/36
	// Grab returned session cookie
  session_cookie = res.headers['set-cookie'][0].split(';')[0];

	var query = querystring.stringify({
		gui: 'ng',
		output: "json",
		catalogName: "dbo.CONTROLS_Basic",
		controlType: 'gridView',
		mode: 'readonly'
	})

	frisby.create('Read gridView/readonly')
	  .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/read?' + query)
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: "read",
			gui: "ng",
			output: "json",
			data: {
				total: "2",
				catalog: {
					dbId: panax_config.db.database,
					catalogName: 'dbo.CONTROLS_Basic',
					controlType: 'gridView',
					mode: 'readonly'
					//lang:
				}
			}
		})
		.expectJSONLength('data.model', 2)
		.after(formview_readonly)
	.toss()
}

/**
 * Test Read formView/readonly
 * (when logged in)
 */
function formview_readonly(err, res, body) {

	var query = querystring.stringify({
		gui: 'ng',
		output: "json",
		filters: "'id=1'",
		catalogName: "dbo.CONTROLS_Basic",
		controlType: 'formView',
		mode: 'readonly'
	})

	frisby.create('Read formView/readonly')
	  .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/read?' + query)
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: "read",
			gui: "ng",
			output: "json",
			data: {
				total: "1",
				catalog: {
					dbId: panax_config.db.database,
					catalogName: 'dbo.CONTROLS_Basic',
					controlType: 'formView',
					mode: 'readonly'
					//lang:
				}
			}
		})
		.expectJSONLength('data.model', 1)
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
		.expectStatus(401)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: false
		})
	.toss();
}