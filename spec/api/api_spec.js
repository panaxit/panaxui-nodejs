/**
 * API Frisby tests
 */

var frisby = require('frisby');
var	panaxui = require('../../panaxui');

var	hostname = panaxui.config.hostname,
	port = panaxui.config.port,
	url = 'http://' + hostname + ':' + port + '/api';

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
.toss();

frisby.create('Get sitemap when logged in')
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
.toss();

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
.toss();

//ToDo: frisby.create('Deny sitemap when logged out')