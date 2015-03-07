/**
 * GUI AngularJS Testing
 *
 * 1. Read AngularJS root
 */
var frisby = require('frisby');
var	panax_config = require('../config/panax');

var	hostname = panax_config.ui.hostname,
	port = panax_config.ui.port,
	url = 'http://' + hostname + ':' + port;

/**
 * Test Read AngularJS root
 * (when logged in)
 */
frisby.create('Read ExtJS root')
	.get(url + '/gui/ng')
	.expectStatus(200)
	.expectHeaderContains('content-type', 'text/html')
.toss()
