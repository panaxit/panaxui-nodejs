/**
 * API Session Tests
 */

var frisby = require('frisby');
var	panaxui = require('../../panaxui');

var	hostname = panaxui.config.hostname,
	port = panaxui.config.port,
	url = 'http://' + hostname + ':' + port + '/api';

/**
 * Test login
 */
frisby.create('Login')
	.post(url + panaxui.api.login, {
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
 * Test get sitemap when logged in
 */
function get_sitemap(err, res, body) {
	frisby.create('Get sitemap')
		.get(url + panaxui.api.sitemap)
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
		.after(logout) // Chain tests (sync http requests)
	.toss()
}


/**
 * Test logout
 */
function logout(err, res, body) {
	frisby.create('Logout')
		.get(url + panaxui.api.logout)
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true
		})
		.expectJSONTypes({
			success: Boolean
		})
		//.after(fail_sitemap) // Chain tests (sync http requests)
	.toss();
}

/**
 * Test logout
 */
// function fail_sitemap(err, res, body) {
// 	frisby.create('Fail sitemap')

// 	.toss();
// }