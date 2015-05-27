/**
 * API Nested Table Create, Update, Delete Testing
 * 
 * As AngularJS frontend
 * 
 * 1. Login
 * 2. POST 		Create JSON Data
 * 4. PUT 		Update JSON Data
 * 5. DELETE 	Delete JSON Data
 */
var frisby = require('frisby');
var	util = require('../lib/util');
var	panax_config = require('../config/panax');

var	hostname = panax_config.ui.hostname,
	port = panax_config.ui.port,
	url = 'http://' + hostname + ':' + port;

// Global session cookie to be passed with each request
var session_cookie;

// Gobal primary & identity values to be passed
var primaryValue;
var identityValue;

/**
 * Login Entrypoint
 */
frisby.create('Login')
	.post(url + '/api/session/login', {
		username: panax_config.ui.username,
		password: util.md5(panax_config.ui.password)
	})
	.expectStatus(200)
	.after(post_create)
.toss();

/**
 * Test POST Create
 */
function post_create(err, res, body) {

	// Grab returned session cookie
  session_cookie = res.headers['set-cookie'][0].split(';')[0];

  var payload = {
  	tableName: 'dbo.CONTROLS_NestedForm',
  	primaryKey: 'Id',
  	identityKey: 'Id',
  	dataRows: [{
		  "TextLimit10Chars": "Texto corto",
		  "CONTROLS_NestedGrid": {
		  	"TextLimit255": "Corto Anidado"
		  }
		}]
  };

  frisby.create('POST Create')
	  .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.post(url + '/api/create', payload, {json: true})
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: "create"
		})
		.expectJSONLength('data', 1)
		.expectJSON('data.*', {
			status: 'success',
			dataTable: 'dbo.CONTROLS_NestedForm',
			primaryValue: function(val) { 
				expect(val).toBeTruthy(); 
				primaryValue = parseInt(val); 
			},
			identityValue: function(val) { 
				expect(val).toBeTruthy(); 
				identityValue = parseInt(val); 
			}
		})
		.after(delete_delete)
	.toss()
}

/**
 * Test PUT Update
 */
function put_update(err, res, body) {

  var payload = {
  	tableName: 'dbo.CONTROLS_NestedForm',
  	primaryKey: 'Id',
  	identityKey: 'Id',
  	dataRows: [{
	  	"Id": primaryValue,
		  "TextLimit10Chars": "Texto corto 2",
		  "CONTROLS_NestedGrid": {
		  	"TextLimit255": "Corto Anidado 2"
		  }
		}]
  };

  frisby.create('PUT Update')
	  .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.put(url + '/api/update', payload, {json: true})
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: "update"
		})
		.expectJSONLength('data', 1)
		.expectJSON('data.*', {
			status: 'success',
			dataTable: 'dbo.CONTROLS_NestedForm'
		})
		.after(delete_delete)
	.toss()
}

/**
 * Test DELETE Delete
 */
function delete_delete(err, res, body) {

  var payload = {
  	tableName: 'dbo.CONTROLS_NestedForm',
  	primaryKey: 'Id',
  	identityKey: 'Id',
  	deleteRows: [{
	  	"Id": primaryValue
		}]
  };

  frisby.create('DELETE Delete')
	  .addHeader('Cookie', session_cookie) // Pass session cookie with each request
		.delete(url + '/api/delete', payload, {json: true})
		.expectStatus(200)
		.expectHeaderContains('content-type', 'application/json')
		.expectJSON({
			success: true,
			action: "delete"
		})
		.expectJSONLength('data', 1)
		.expectJSON('data.*', {
			status: 'success',
			dataTable: 'dbo.CONTROLS_NestedForm'
		})
	.toss()
}