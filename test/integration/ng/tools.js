var	config = require('../../../config/panax.js');
var	util = require('../../../lib/util');
var querystring = require("querystring");
var expect = require('chai').expect;
var supertest = require('supertest');
//var api = supertest(require('../../../'));
var api = supertest('http://' + config.ui.hostname + ':' + config.ui.port);

describe.skip('tools (filters, ...)', function() {

	var cookie; // Global session cookie to be passed with each request

	describe('while logged out', function() {
	
		it('should login', function(done) {
			api.post('/api/session/login')
			.send({
				username: config.ui.username,
				password: util.md5(config.ui.password)
			})
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				// ToDo: Should be stateless: https://github.com/vlucas/frisby/issues/36
				// Grab returned session cookie
				cookie = res.headers['set-cookie'][0].split(';')[0];
				done();
			});
		});

	});

	describe('while logged in', function() {

		it('should return correct filters', function(done) {
		  var payload = {
		  	tableName: 'TestSchema.CONTROLS_Basic',
		  	identityKey: 'Id',
		  	dataRows: [{
				  "ShortTextField": "Juan",
				  "IntegerReq": 10,
				  "Float": 40.0
				}]
		  };

			api.post('/api/filters')
			.send(payload)
			.set('Accept', 'application/json')
			.set('Cookie', cookie) // Pass session cookie with each request
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				expect(res.body.success).to.be.true;
				expect(res.body.action).to.equal('ShortTextField = \'Juan\' AND IntegerReq = 10 AND Float = 40.0');
				done();
			});
		});

	});

});