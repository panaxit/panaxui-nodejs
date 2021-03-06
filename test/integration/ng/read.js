var panax_config = require('../../../config/panax')
var panax_instance = panax_config.instances[panax_config.default_instance]
var util = require('../../../lib/util')
var querystring = require('querystring')
var expect = require('chai').expect
var supertest = require('supertest')
var app = require('../../../')
var api = (process.env.NODE_ENV === 'testing') ? supertest(app) : supertest('http://' + panax_instance.ui.hostname + ':' + panax_instance.ui.port)

describe('read', function() {

  var cookie // Global session cookie to be passed with each request

  describe('while logged out', function() {

    it('should fail to read an entity', function(done) {
      var query = querystring.stringify({
        gui: 'ng',
        output: 'json',
        catalogName: '[TestSchema].[CONTROLS_Basic]'
      })

      api.get('/api/read?' + query)
        .set('Accept', 'application/json')
        .expect(401)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.success).to.be.false
          done()
        })
    })

    it('should fail to read options of an entity', function(done) {
      var query = querystring.stringify({
        gui: 'ng',
        catalogName: '[TestSchema].[Pais]'
      })

      api.get('/api/options?' + query)
        .set('Accept', 'application/json')
        .expect(401)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.success).to.be.false
          done()
        })
    })

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

    describe('output: json', function() {

      it('should read gridView/readonly', function(done) {
        var query = querystring.stringify({
          gui: 'ng',
          output: 'json',
          catalogName: '[TestSchema].[CONTROLS_Basic]',
          controlType: 'gridView',
          mode: 'readonly',
          pageSize: '5',
          pageIndex: '9'
        })

        api.get('/api/read?' + query)
          .set('Accept', 'application/json')
          .set('Cookie', cookie) // Pass session cookie with each request
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.success).to.be.true
            expect(res.body.action).to.equal('read')
            expect(res.body.gui).to.equal('ng')
            expect(res.body.output).to.equal('json')
            expect(res.body.data.model.length).to.equal(42 - (5 * (Math.floor((42 / 5))))) // totalRecords-(pageSize*(Math.floor((total/pageSize))))
            expect(res.body.data.metadata.totalItems).to.equal(42)
            expect(res.body.data.metadata.dbId).to.equal(panax_instance.db.database)
            expect(res.body.data.metadata.catalogName).to.equal('[TestSchema].[CONTROLS_Basic]')
            expect(res.body.data.metadata.controlType).to.equal('gridView')
            expect(res.body.data.metadata.mode).to.equal('readonly')
            expect(res.body.data.metadata.primaryKey).to.equal('Id')
            expect(res.body.data.metadata.identityKey).to.equal('Id')
            done()
          })
      })

      it('should read cardsView/readonly', function(done) {
        var query = querystring.stringify({
          gui: 'ng',
          output: 'json',
          catalogName: '[TestSchema].[CONTROLS_Basic]',
          controlType: 'cardsView',
          mode: 'readonly'
        })

        api.get('/api/read?' + query)
          .set('Accept', 'application/json')
          .set('Cookie', cookie) // Pass session cookie with each request
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.success).to.be.true
            expect(res.body.action).to.equal('read')
            expect(res.body.gui).to.equal('ng')
            expect(res.body.output).to.equal('json')
            expect(res.body.data.model.length).to.equal(42)
            expect(res.body.data.metadata.totalItems).to.equal(42)
            expect(res.body.data.metadata.dbId).to.equal(panax_instance.db.database)
            expect(res.body.data.metadata.catalogName).to.equal('[TestSchema].[CONTROLS_Basic]')
            expect(res.body.data.metadata.controlType).to.equal('cardsView')
            expect(res.body.data.metadata.mode).to.equal('readonly')
            expect(res.body.data.metadata.primaryKey).to.equal('Id')
            expect(res.body.data.metadata.identityKey).to.equal('Id')
            done()
          })
      })

      it('should read formView/readonly', function(done) {
        var query = querystring.stringify({
          gui: 'ng',
          output: 'json',
          filters: "'id=1'",
          catalogName: '[TestSchema].[CONTROLS_Basic]',
          controlType: 'formView',
          mode: 'readonly'
        })

        api.get('/api/read?' + query)
          .set('Accept', 'application/json')
          .set('Cookie', cookie) // Pass session cookie with each request
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.success).to.be.true
            expect(res.body.action).to.equal('read')
            expect(res.body.gui).to.equal('ng')
            expect(res.body.output).to.equal('json')
            expect(res.body.data.model.length).to.equal(1)
            expect(res.body.data.metadata.totalItems).to.equal(1)
            expect(res.body.data.metadata.dbId).to.equal(panax_instance.db.database)
            expect(res.body.data.metadata.catalogName).to.equal('[TestSchema].[CONTROLS_Basic]')
            expect(res.body.data.metadata.controlType).to.equal('formView')
            expect(res.body.data.metadata.mode).to.equal('readonly')
            //expect(res.body.data.metadata.primaryKey).to.equal('Id');
            //expect(res.body.data.metadata.identityKey).to.equal('Id');
            done()
          })
      })

      it('should read options', function(done) {
        var query = querystring.stringify({
          gui: 'ng',
          //array: true, // to skip headers
          catalogName: '[TestSchema].[Pais]',
          valueColumn: 'Id',
          textColumn: 'Pais'
        })

        api.get('/api/options?' + query)
          .set('Accept', 'application/json')
          .set('Cookie', cookie) // Pass session cookie with each request
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.success).to.be.true
            expect(res.body.action).to.equal('options')
            expect(res.body.gui).to.equal('ng')
            expect(res.body.data.length).to.be.above(0)
            done()
          })
      })

      it('should read nested form')

      it('should read nested grid')

    })

    describe('output: pate', function() {

      it('should read fileTemplate', function(done) {
        var query = querystring.stringify({
          gui: 'ng',
          output: 'pate',
          filters: "'id=1'",
          catalogName: '[TestSchema].[CONTROLS_Basic]',
          controlType: 'fileTemplate',
          mode: 'readonly'
        })

        api.get('/api/read?' + query)
          .set('Accept', 'application/json')
          .set('Cookie', cookie) // Pass session cookie with each request
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.success).to.be.true
            expect(res.body.action).to.equal('read')
            expect(res.body.gui).to.equal('ng')
            expect(res.body.output).to.equal('pate')
            expect(res.body.template).to.exist
            expect(res.body.template.contentType).to.exist
            expect(res.body.template.template).to.exist
            expect(res.body.data.metadata.totalItems).to.equal(1)
            expect(res.body.data.metadata.dbId).to.equal(panax_instance.db.database)
            expect(res.body.data.metadata.catalogName).to.equal('[TestSchema].[CONTROLS_Basic]')
            expect(res.body.data.metadata.controlType).to.equal('fileTemplate')
            expect(res.body.data.metadata.mode).to.equal('readonly')
            done()
          })
      })

      it('should read fileTemplate [asFile]', function(done) {
        var query = querystring.stringify({
          gui: 'ng',
          output: 'pate',
          filters: "'id=1'",
          catalogName: '[TestSchema].[CONTROLS_Basic]',
          controlType: 'fileTemplate',
          mode: 'readonly',
          asFile: true
        })

        api.get('/api/read?' + query)
          .set('Accept', 'application/json')
          .set('Cookie', cookie) // Pass session cookie with each request
          .expect(200)
          .expect('Content-Type', /html/)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body).to.be.ok
            done()
          })
      })

      it('should fail to read fileTemplate [asFile]', function(done) {
        var query = querystring.stringify({
          gui: 'ng',
          output: 'pate',
          filters: "'id=1'",
          catalogName: '[TestSchema].[Pais]', // has no fileTemplate defined
          controlType: 'fileTemplate',
          mode: 'readonly',
          asFile: true
        })

        api.get('/api/read?' + query)
          .set('Accept', 'application/json')
          .set('Cookie', cookie) // Pass session cookie with each request
          .expect(500)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err)
            expect(res.body.success).to.be.false
            done()
          })
      })

    })

  })

});
