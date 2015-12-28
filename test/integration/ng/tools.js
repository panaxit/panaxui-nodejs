var panax_config = require('../../../config/panax')
var panax_instance = panax_config.instances[panax_config.default_instance]
var util = require('../../../lib/util')
var querystring = require('querystring')
var expect = require('chai').expect
var supertest = require('supertest')
var app = require('../../../')
var api = (process.env.NODE_ENV === 'testing') ? supertest(app) : supertest('http://' + panax_instance.ui.hostname + ':' + panax_instance.ui.port)

describe('tools (filters, ...)', function() {

  var cookie // Global session cookie to be passed with each request

  describe('while logged out', function() {

    it('should login', function(done) {
      api.post('/api/session/login')
        .send({
          username: panax_instance.ui.username,
          password: util.md5(panax_instance.ui.password)
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err)
          // ToDo: Should be stateless: https://github.com/vlucas/frisby/issues/36
          // Grab returned session cookie
          cookie = res.headers['set-cookie'][0].split(';')[0]
          done()
        })
    })

  })

  describe('while logged in', function() {

    it('should return correct filters', function(done) {
      var payload = {
        tableName: 'TestSchema.CONTROLS_Basic',
        dataRows: [{
          'ShortTextField': 'Juan',
          'IntegerReq': 10,
          'Float': 40.0
        }]
      }

      api.post('/api/filters')
        .send(payload)
        .set('Accept', 'application/json')
        .set('Cookie', cookie) // Pass session cookie with each request
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.success).to.be.true
          expect(res.body.action).to.equal('filters')
          expect(res.body.data).to.equal("ShortTextField COLLATE Latin1_General_CI_AI LIKE  '%'+REPLACE('Juan', ' ', '%')+'%' AND IntegerReq = 10 AND Float = 40")
          done()
        })
    })

  })

});
