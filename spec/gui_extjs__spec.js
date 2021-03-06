/**
 * GUI ExtJS Testing
 *
 * 1. Read ExtJS root
 */
var frisby = require('frisby');
var	panax_config = require('../config/panax');

var	hostname = panax_config.ui.hostname,
	port = panax_config.ui.port,
	url = 'http://' + hostname + ':' + port;

/**
 * Test Read ExtJS root
 * (when logged in)
 */
frisby.create('Read ExtJS root')
	.get(url + '/gui/extjs')
	.expectStatus(200)
	.expectHeaderContains('content-type', 'text/html')
.toss()