var express = require('express')
var router = express.Router() // eslint-disable-line new-cap
var PanaxJS = require('panaxjs')
var panaxConfig = require('../config/panax.js')

var auth = require('../lib/auth.js')
var xml = require('../transformers/xml.js')

module.exports = router

/**
 * POST /api/create
 *
 * Create Entity
 */
router.post('/', auth.requiredAuth, function read(req, res, next) {
  var panaxdb, insertXML
  
  if (!req.body.tableName) {
    return next({
      message: 'No tableName supplied',
    })
  }
  if (!req.body.primaryKey && !req.body.identityKey) {
    return next({
      message: 'No primaryKey or identityKey supplied',
    })
  }
  if (!req.body.insertRows || !req.body.insertRows.length || req.body.insertRows.length === 0) {
    return next({
      message: 'No insertRows supplied',
    })
  }

  /**
   * Build dataTable XML
   */
  insertXML = xml.dataTable(req.body)

  /**
   * PanaxJS
   */
  panaxdb = new PanaxJS.Connection(panaxConfig.instances[panaxConfig.default_instance])

  panaxdb.setParam('userId', req.session.userId)

  panaxdb.persist(insertXML, function(err, xml) {
    if (err) {
      return next(err)
    }

    PanaxJS.Util.parseResults(xml, function(err, results) {
      if (err) {
        return next(err)
      }

      res.json({
        success: true,
        action: 'create',
        data: results,
      })
    })
  })
})
