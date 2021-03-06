var express = require('express')
var router = express.Router() // eslint-disable-line new-cap
var libxslt = require('libxslt')
var PanaxJS = require('panaxjs')
var panaxConfig = require('../config/panax.js')

var entities = require('entities')
var pateWrapper = require('../lib/pateWrapper')
var util = require('../lib/util.js')
var auth = require('../lib/auth.js')

module.exports = router

/**
 * GET /api/read
 *
 * Read Entity DATA
 */
router.get('/', auth.requiredAuth, function read(req, res, next) {
  var panaxInstance, panaxdb

  if (!req.query.catalogName) {
    return next({
      message: 'No catalogName supplied',
    })
  }

  req.query.gui = (req.query.gui || panaxConfig.enabled_guis[0]).toLowerCase() // Default GUI
  if (panaxConfig.enabled_guis.indexOf(req.query.gui) === -1) {
    return next({
      message: "Unsupported GUI '" + req.query.gui + "'." +
        'Available: ' + panaxConfig.enabled_guis.toString().split(',').join(', '),
    })
  }

  req.query.output = (req.query.output || 'json').toLowerCase() // JSON is default output
  if (req.query.output !== 'json' && req.query.output !== 'html' && req.query.output !== 'pate') {
    return next({
      message: "Unsupported output '" + req.query.output + "'.",
    })
  }

  /**
   * PanaxJS
   */
  panaxInstance = panaxConfig.instances[panaxConfig.default_instance]
  panaxdb = new PanaxJS.Connection(panaxInstance, req.query)

  panaxdb.setParam('userId', req.session.userId)
  panaxdb.setParam('tableName', req.query.catalogName)
  panaxdb.setParam('getData', (req.query.getData || '1'))
  panaxdb.setParam('getStructure', (req.query.getStructure || '0'))
  panaxdb.setParam('lang', (req.session.lang || 'DEFAULT'))
  if (req.query.filters) {
    panaxdb.setParam('filters', entities.decodeXML(req.query.filters))
  }

  panaxdb.read(function(err, xml) {
    if (err) {
      return next(err)
    }

    PanaxJS.Util.parseMetadata(xml, function(err, metadata) {
      var jsTransformer, templatePath

      if (err) {
        return next(err)
      }

      if (req.query.gui === 'ng') {
        /*
				Use JS Transformers for AngularJS
				 */
        jsTransformer = require('../transformers/' + req.query.gui + '/' + req.query.output + '.js')
        jsTransformer.transform(xml, function(err, result) {
          if (err) {
            return next(err)
          }

          if (req.query.output === 'pate' && metadata.controlType === 'fileTemplate') {
            /*
            Use Pate for file template
             */
            if (!metadata.fileTemplate) {
              return next({
                message: 'Missing fileTemplate',
              })
            }

            templatePath = 'templates/' +
                                panaxInstance.db.database +
                                '/' + req.query.catalogName +
                                '/' + metadata.fileTemplate

            pateWrapper.parse(xml, templatePath, function(err, template, mimeType) {
              if (err) {
                return next(err)
              }
              if (req.query.asFile) {
                res.header('Content-Type', mimeType)
                res.send(template)
              } else {
                res.json({
                  success: true,
                  action: 'read',
                  gui: req.query.gui,
                  output: req.query.output,
                  data: result,
                  template: {
                    template: template,
                    contentType: mimeType,
                  },
                })
              }
            })
          } else if (req.query.output === 'json') {
            /*
            Plain JSON response for other calls
             */
            res.json({
              success: true,
              action: 'read',
              gui: req.query.gui,
              output: req.query.output,
              data: result,
            })
          }
        })
      } else {
        /*
				Use XSLT for anything else
				 */
        libxslt.parseFile('xsl/' + req.query.gui + '/' + req.query.output + '.xsl', function(err, stylesheet) {
          if (err) {
            return next(err)
          }

          stylesheet.apply(xml, function(err, result) {
            if (err) {
              return next(err)
            }

            if (req.query.output === 'json') {
              try {
                res.json({
                  success: true,
                  action: 'read',
                  gui: req.query.gui,
                  output: req.query.output,
                  data: JSON.parse(util.sanitizeJSONString(result)),
                })
              } catch (e) {
                return next({
                  message: '[Server Exception] ' + e.name + ': ' + e.message,
                  stack: e.stack,
                  result: result.replace(/\n/g, '').replace(/\t/g, ''),
                })
              }
            } else if (req.query.output === 'html') {
              res.set('Content-Type', 'text/html')
              res.send(result)
            }
          })
        })
      }
    })
  })
})
