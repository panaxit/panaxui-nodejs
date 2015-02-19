/**
 * API Build Testing
 *
 * 1. Login
 * 2. Build ExtJS GUI
 * 3. Re-Build ExtJS GUI
 * 4. Existing ExtJS GUI
 * 5. Logout
 * 6. Fail Build ExtJS GUI
 */
var frisby = require('frisby');
var path = require('path');
var fs = require('fs');
var	util = require('../lib/util');
var	panax_config = require('../config/panax');

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
	.after(build_extjs_gui)
.toss();

/**
 * Test Build ExtJS GUI
 * (when logged in)
 */
function build_extjs_gui(err, res, body) {

	// ToDo: Should be stateless: https://github.com/vlucas/frisby/issues/36
	// Grab returned session cookie
    session_cookie = res.headers['set-cookie'][0].split(';')[0];

	// Remove previous generated files
	var sLocation = path.join(panax_config.ui.guis['extjs'].root, "cache");
	if(fs.existsSync(sLocation))
		util.deleteFolderRecursive(sLocation);

	frisby.create('Build ExtJS GUI')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/build?catalogName=dbo.Empleado&ouput=extjs')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: "built",
			output: "extjs",
			catalog: {
				dbId: panax_config.db.database,
				Table_Schema: "dbo",
				Table_Name: "Empleado",
				//mode:
				//controlType:
				//lang:
			}
		})
		.expectJSONTypes({
			success: Boolean,
			action: String,
			catalog: {
				dbId: String,
				Table_Schema: String,
				Table_Name: String,
				// mode: String,
				// controlType: String,
				// lang: String
			}
		})
		.after(rebuild_extjs_gui)
	.toss()
}

/**
 * Test Re-Build ExtJS GUI
 * (when logged in)
 */
function rebuild_extjs_gui(err, res, body) {

	frisby.create('Re-Build ExtJS GUI')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/build?catalogName=dbo.Empleado&ouput=extjs&rebuild=1')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: "built",
			output: "extjs",
			catalog: {
				dbId: panax_config.db.database,
				Table_Schema: "dbo",
				Table_Name: "Empleado",
				//mode:
				//controlType:
				//lang:
			}
		})
		.expectJSONTypes({
			success: Boolean,
			action: String,
			catalog: {
				dbId: String,
				Table_Schema: String,
				Table_Name: String,
				// mode: String,
				// controlType: String,
				// lang: String
			}
		})
		.after(existing_extjs_gui)
	.toss()
}

/**
 * Test Existing ExtJS GUI
 * (when logged in)
 */
function existing_extjs_gui(err, res, body) {

	frisby.create('Existing ExtJS GUI')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/build?catalogName=dbo.Empleado&ouput=extjs')
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: "existing",
			output: "extjs",
			//filename:
			catalog: {
				dbId: panax_config.db.database,
				Table_Schema: "dbo",
				Table_Name: "Empleado",
				//mode:
				//controlType:
				//lang:
			}
		})
		.expectJSONTypes({
			success: Boolean,
			action: String,
			filename: String,
			catalog: {
				dbId: String,
				Table_Schema: String,
				Table_Name: String,
				// mode: String,
				// controlType: String,
				// lang: String
			}
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
		.after(fail_build)
	.toss();
}

/**
 * Test Fail Re-Build ExtJS GUI
 * (when logged out)
 */
function fail_build(err, res, body) {
	frisby.create('Fail Re-Build ExtJS GUI')
	    .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.get(url + '/api/build?catalogName=dbo.Empleado&ouput=extjs')
		.expectStatus(401)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: false
		})
		.expectJSONTypes({
			success: Boolean
		})
	.toss();
}