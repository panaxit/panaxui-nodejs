var	config = require('../../../config/panax');
var	util = require('../../../lib/util');
var querystring = require("querystring");
var expect = require('chai').expect;
var supertest = require('supertest');
//var api = supertest(require('../../../'));
var api = supertest('http://' + config.ui.hostname + ':' + config.ui.port);

describe('persistance (create, update, delete)', function() {

	var cookie; // Global session cookie to be passed with each request

	describe('while logged out', function() {

		it('should fail to create/update/delete an entity');
	
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

	  describe('case 1: with primaryKey', function() {

	  	it('should create multiple (2) entities');

	  	it('should update one (1) entity');

	  	it('should delete one (1) entity');

	  });

	  describe('case 2: with identityKey', function() {

			var identityValue;

			it('should create multiple (2) entities', function(done) {
			  var payload = {
			  	tableName: 'dbo.CONTROLS_Basic',
			  	identityKey: 'Id',
			  	insertRows: [{
				  	//"Id": 'NULL',
				  	//"Id": 'NULL',
					  "ShortTextField": "Texto corto",
					  "IntegerReq": 32,
					  "Float": 72,
					  "Combobox": "MX",
					  "RadioGroup": "1",
					  "Boolean": true,
					  "Money": null,
					  "Date": "2014-04-25 00:00:00"
					}, {
				  	//"Id": 'NULL',
				  	//"Id": 'NULL',
					  "ShortTextField": "Tmp",
					  "IntegerReq": 10
					}]
			  };

				api.post('/api/create')
				.send(payload)
				.set('Accept', 'application/json')
				.set('Cookie', cookie) // Pass session cookie with each request
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) return done(err);
					expect(res.body.success).to.be.true;
					expect(res.body.action).to.equal('create');
					expect(res.body.data.length).to.equal(2);
					expect(res.body.data[0].status).to.equal('success');
					expect(res.body.data[0].action).to.equal('insert');
					expect(res.body.data[0].tableName).to.equal('[dbo].[CONTROLS_Basic]');
					expect(res.body.data[0].identity).to.be.ok;
					expect(res.body.data[1].status).to.equal('success');
					expect(res.body.data[1].action).to.equal('insert');
					expect(res.body.data[1].tableName).to.equal('[dbo].[CONTROLS_Basic]');
					expect(res.body.data[1].identity).to.be.ok;
					identityValue = res.body.data[1].identity;
					done();
				});
			});

			it('should update one (1) entity', function(done) {
			  var payload = {
			  	tableName: 'dbo.CONTROLS_Basic',
			  	identityKey: 'Id',
			  	updateRows: [{
				  	"Id": identityValue,
					  "Float": 41.5
					}]
			  };

				api.put('/api/update')
				.send(payload)
				.set('Accept', 'application/json')
				.set('Cookie', cookie) // Pass session cookie with each request
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) return done(err);
					expect(res.body.success).to.be.true;
					expect(res.body.action).to.equal('update');
					expect(res.body.data.length).to.equal(1);
					expect(res.body.data[0].status).to.equal('success');
					expect(res.body.data[0].action).to.equal('update');
					expect(res.body.data[0].tableName).to.equal('[dbo].[CONTROLS_Basic]');
					done();
				});
			});

			it('should delete one (1) entity', function(done) {
			  var payload = {
			  	tableName: 'dbo.CONTROLS_Basic',
			  	identityKey: 'Id',
			  	deleteRows: [{
				  	"Id": identityValue
					}]
			  };

				api.delete('/api/delete')
				.send(payload)
				.set('Accept', 'application/json')
				.set('Cookie', cookie) // Pass session cookie with each request
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) return done(err);
					expect(res.body.success).to.be.true;
					expect(res.body.action).to.equal('delete');
					expect(res.body.data.length).to.equal(1);
					expect(res.body.data[0].status).to.equal('success');
					expect(res.body.data[0].action).to.equal('delete');
					expect(res.body.data[0].tableName).to.equal('[dbo].[CONTROLS_Basic]');
					done();
				});
			});

		});

	  describe('case 3: with primaryKey & identityKey', function() {

	  	it('should create multiple (2) entities');

	  	it('should update one (1) entity');

	  	it('should delete one (1) entity');

	  });

	  describe.skip('case 4: nested (1:1)', function() {

			var identityValue;
			var primaryValue;

	  	it('should create a nested entity', function() {
	  		var payload = {
			  	tableName: 'dbo.CONTROLS_NestedForm',
			  	primaryKey: 'Id',
			  	identityKey: 'Id',
			  	insertRows: [{
					  "TextLimit10Chars": "Texto corto",
					  "CONTROLS_NestedGrid": {
					  	"TextLimit255": "Corto Anidado"
					  }
					}]
	  		};

				api.post('/api/create')
				.send(payload)
				.set('Accept', 'application/json')
				.set('Cookie', cookie) // Pass session cookie with each request
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) return done(err);
					expect(res.body.success).to.be.true;
					expect(res.body.action).to.equal('create');
					expect(res.body.data.length).to.equal(1);
					expect(res.body.data[0].status).to.equal('success');
					expect(res.body.data[0].action).to.equal('insert');
					expect(res.body.data[0].tableName).to.equal('[dbo].[CONTROLS_NestedForm]');
					expect(res.body.data[0].identity).to.be.ok;
					expect(res.body.data[0].primaryValue).to.be.ok;
					identityValue = res.body.data[0].identity;
					primaryValue = res.body.data[0].primaryValue;
					done();
				});
	  	});

	  	it('should update a nested entity');

	  	it('should delete a nested entity');

	  });

	});

});