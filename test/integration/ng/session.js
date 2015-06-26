var	config = require('../../../config/panax');
var	util = require('../../../lib/util');
var querystring = require("querystring");
var expect = require('chai').expect;
var supertest = require('supertest');
//var api = supertest(require('../../../'));
var api = supertest('http://' + config.ui.hostname + ':' + config.ui.port);

describe('Session', function() {

	var cookie; // Global session cookie to be passed with each request

	var query = querystring.stringify({
		gui: 'ng',
		output: "json"
	});

	describe('while logged out', function() {

		it('should fail to login with wrong credentials', function (done) {
			api.post('/api/session/login')
			.send({
				username: config.ui.username,
				password: 'wrong'
			})
			.set('Accept', 'application/json')
			.expect(401)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				expect(res.body.success).to.be.false;
				// ToDo: Should be stateless: https://github.com/vlucas/frisby/issues/36
				// Grab returned session cookie
				cookie = res.headers['set-cookie'][0].split(';')[0];
				done();
			});
		});

		it('should fail to get info', function (done) {
			api.get('/api/session/info')
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

		it('should fail to get sitemap', function (done) {
			api.get('/api/session/sitemap?' + query)
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

		it('should login with right credentials', function (done) {
			api.post('/api/session/login')
			.send({
				username: config.ui.username,
				password: util.md5(config.ui.password)
			})
			.set('Accept', 'application/json')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				expect(res.body.success).to.be.true;
				expect(res.body.action).to.equal('login');
				// ToDo: Should be stateless: https://github.com/vlucas/frisby/issues/36
				// Grab returned session cookie
				cookie = res.headers['set-cookie'][0].split(';')[0];
				done();
			});
		});

	});

	describe('while logged in', function() {

		it('should get info', function (done) {
			api.get('/api/session/info')
			.set('Accept', 'application/json')
			.set('Cookie', cookie) // Pass session cookie with each request
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				expect(res.body.success).to.be.true;
				expect(res.body.action).to.equal('info');
				expect(res.body.data.username).to.equal(config.ui.username);
				expect(res.body.data.api_version).to.equal('0.0.1'); // ToDo: Centralized version number
				expect(res.body.data.db.server).to.equal(config.db.server);
				//expect(res.body.data.db.vendor).to.equal('SQL Server 2012 11.0.5058');
				expect(res.body.data.db.version).to.equal(config.db.version);
				expect(res.body.data.db.database).to.equal(config.db.database);
				expect(res.body.data.db.user).to.equal(config.db.user);
				done();
			});
		});

		it('should get sitemap', function (done) {
			api.get('/api/session/sitemap?' + query)
			.set('Accept', 'application/json')
			.set('Cookie', cookie) // Pass session cookie with each request
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				expect(res.body.success).to.be.true;
				expect(res.body.action).to.equal('sitemap');
				expect(res.body.gui).to.equal('ng');
				expect(res.body.data.length).to.be.above(0);
				done();
			});
		});

		it('should logout', function (done) {
			api.get('/api/session/logout')
			.set('Accept', 'application/json')
			.set('Cookie', cookie) // Pass session cookie with each request
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				expect(res.body.success).to.be.true;
				expect(res.body.action).to.equal('logout');
				done();
			});
		});

	});

});