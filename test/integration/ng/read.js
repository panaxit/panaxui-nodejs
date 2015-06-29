var	config = require('../../../config/panax');
var	util = require('../../../lib/util');
var querystring = require("querystring");
var expect = require('chai').expect;
var supertest = require('supertest');
//var api = supertest(require('../../../'));
var api = supertest('http://' + config.ui.hostname + ':' + config.ui.port);

describe('Read', function() {

	var cookie; // Global session cookie to be passed with each request

	describe('while logged out', function() {

		it('should fail to read an entity', function(done) {
			var query = querystring.stringify({
				gui: 'ng',
				output: "json",
				catalogName: "dbo.CONTROLS_Basic"
			});

			api.get('/api/read?' + query)
			.set('Accept', 'application/json')
			.set('Cookie', cookie) // Pass session cookie with each request
			.expect(401)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				expect(res.body.success).to.be.false;
				done();
			});
		});

		it('should fail to read options of an entity', function(done) {
			var query = querystring.stringify({
				gui: 'ng',
				catalogName: "CatalogosSistema.Pais"
			});

			api.get('/api/options?' + query)
			.set('Accept', 'application/json')
			.set('Cookie', cookie) // Pass session cookie with each request
			.expect(401)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				expect(res.body.success).to.be.false;
				done();
			});
		});
	
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

		it('should read gridView/readonly', function(done) {
			var query = querystring.stringify({
				gui: 'ng',
				output: "json",
				catalogName: "dbo.CONTROLS_Basic",
				controlType: 'gridView',
				mode: 'readonly'
			});

			api.get('/api/read?' + query)
			.set('Accept', 'application/json')
			.set('Cookie', cookie) // Pass session cookie with each request
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				expect(res.body.success).to.be.true;
				expect(res.body.action).to.equal('read');
				expect(res.body.gui).to.equal('ng');
				expect(res.body.output).to.equal('json');
				expect(res.body.data.total).to.be.above(0);
				expect(res.body.data.model.length).to.be.above(0);
				expect(res.body.data.catalog.dbId).to.equal(config.db.database);
				expect(res.body.data.catalog.catalogName).to.equal('dbo.CONTROLS_Basic');
				expect(res.body.data.catalog.controlType).to.equal('gridView');
				expect(res.body.data.catalog.mode).to.equal('readonly');
				expect(res.body.data.catalog.primaryKey).to.equal('Id');
				expect(res.body.data.catalog.identityKey).to.equal('Id');
				done();
			});
		});

		it('should read formView/readonly', function(done) {
			var query = querystring.stringify({
				gui: 'ng',
				output: "json",
				filters: "'id=1'",
				catalogName: "dbo.CONTROLS_Basic",
				controlType: 'formView',
				mode: 'readonly'
			});

			api.get('/api/read?' + query)
			.set('Accept', 'application/json')
			.set('Cookie', cookie) // Pass session cookie with each request
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				expect(res.body.success).to.be.true;
				expect(res.body.action).to.equal('read');
				expect(res.body.gui).to.equal('ng');
				expect(res.body.output).to.equal('json');
				expect(res.body.data.total).to.equal('1');
				expect(res.body.data.model.length).to.equal(1);
				expect(res.body.data.catalog.dbId).to.equal(config.db.database);
				expect(res.body.data.catalog.catalogName).to.equal('dbo.CONTROLS_Basic');
				expect(res.body.data.catalog.controlType).to.equal('formView');
				expect(res.body.data.catalog.mode).to.equal('readonly');
				//expect(res.body.data.catalog.primaryKey).to.equal('Id');
				//expect(res.body.data.catalog.identityKey).to.equal('Id');
				done();
			});
		});

		it('should read options', function(done) {
			var query = querystring.stringify({
				gui: 'ng',
				//array: true, // to skip headers
				catalogName: "CatalogosSistema.Pais",
				valueColumn: "Id",
				textColumn: "Pais"
			});

			api.get('/api/options?' + query)
			.set('Accept', 'application/json')
			.set('Cookie', cookie) // Pass session cookie with each request
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				expect(res.body.success).to.be.true;
				expect(res.body.action).to.equal('options');
				expect(res.body.gui).to.equal('ng');
				expect(res.body.data.length).to.be.above(0)
				done();
			});
		});

	});

});