var express = require('express')
var router = express.Router() // eslint-disable-line new-cap
var libxslt = require('libxslt')
var PanaxJS = require('panaxjs')
var panaxConfig = require('../config/panax.js')

var util = require('../lib/util.js')
var auth = require('../lib/auth.js')

module.exports = router

/**
 * POST /api/session/login
 */
router.post('/login', function login(req, res, next) {
  var panaxInstance, panaxdb

  auth.authenticate(req.body.username, req.body.password, req.body.instance, function(err, userId) {
    if (err) {
      err.status = 401
      return next(err)
    }

    // Set default instance as SINGLETON
    panaxConfig.default_instance = req.body.instance || panaxConfig.default_instance // eslint-disable-line camelcase
    panaxInstance = panaxConfig.instances[panaxConfig.default_instance]
    panaxdb = new PanaxJS.Connection(panaxInstance)

    panaxdb.getInfo(function(err, info) {
      if (err) {
        return next(err)
      }

      req.session.regenerate(function() {

        req.session.panaxInstance = panaxConfig.default_instance // eslint-disable-line camelcase
        req.session.userId = userId
        req.session.username = req.body.username
        // ToDo: Centralized version number
        req.session.api_version = '0.0.1' // eslint-disable-line camelcase
        req.session.node_version = process.version // eslint-disable-line camelcase
        req.session.db = {
          server: panaxInstance.db.server,
          vendor: info.vendor_ver,
          panaxdb: info.panaxdb_ver,
          version: panaxInstance.db.version,
          database: panaxInstance.db.database,
          user: panaxInstance.db.user,
        }

        res.json({
          success: true,
          action: 'login',
          data: req.session,
        })
      })
    })
  })
})

/**
 * GET /api/session/info
 */
router.get('/info', auth.requiredAuth, function sitemap(req, res) {
  res.json({
    success: true,
    action: 'info',
    data: req.session,
  })
})
/**
 * GET /api/session/sitemap
 */
router.get('/sitemap', auth.requiredAuth, function sitemap(req, res, next) {
  var panaxdb

  req.query.gui = (req.query.gui || panaxConfig.enabled_guis[0]).toLowerCase() // Default GUI
  if (panaxConfig.enabled_guis.indexOf(req.query.gui) === -1) {
    return next({
      message: "Unsupported GUI '" + req.query.gui + "'." +
        'Available: ' + panaxConfig.enabled_guis.toString().split(',').join(', '),
    })
  }

  /**
   * PanaxJS
   */
  panaxdb = new PanaxJS.Connection(panaxConfig.instances[panaxConfig.default_instance], req.session)

  panaxdb.getSitemap(function(err, xml) {
    var jsTransformer

    if (err) {
      return next(err)
    }

    if (req.query.gui === 'ng') {
      /*
      Use JS Transformers for AngularJS
       */
      jsTransformer = require('../transformers/' + req.query.gui + '/sitemap.js')
      jsTransformer.transform(xml, function(err, result) {
        if (err) {
          return next(err)
        }
        res.json({
          success: true,
          action: 'sitemap',
          gui: req.query.gui,
          data: result,
        })
      })
    } else {
      /*
      Use XSLT for anything else
       */
      libxslt.parseFile('xsl/' + req.query.gui + '/sitemap.xsl', function(err, stylesheet) {
        if (err) {
          return next(err)
        }

        stylesheet.apply(xml, function(err, result) {
          if (err) {
            return next(err)
          }

          try {
            res.json({
              success: true,
              action: 'sitemap',
              gui: req.query.gui,
              data: JSON.parse(util.sanitizeJSONString(result)),
            })
          } catch (e) {
            return next({
              message: '[Server Exception] ' + e.name + ': ' + e.message,
              stack: e.stack,
              result: result.replace(/\n/g, '').replace(/\t/g, ''),
            })
          }
        })
      })
    }
  })
})

/**
 * GET /api/session/logout
 */
router.get('/logout', function logout(req, res, next) {
  req.session.destroy(function(err) {
    var instances, name

    if (err) {
      return next(err)
    }

    instances = [panaxConfig.default_instance]
    for (name in panaxConfig.instances) {
      if (name !== panaxConfig.default_instance) {
        instances.push(name)
      }
    }
    res.json({
      success: true,
      action: 'logout',
      data: {
        instances: instances,
      },
    })
  })
})
