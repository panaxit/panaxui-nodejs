var express = require('express')
var router = express.Router() // eslint-disable-line new-cap
var PanaxJS = require('panaxjs')
var panaxConfig = require('../config/panax.js')

var auth = require('../lib/auth.js')
var xml = require('../transformers/xml.js')

module.exports = router

/**
 * PUT /api/update
 *
 * Update Entity
 */
router.put('/', auth.requiredAuth, function read(req, res, next) {
  var panaxdb, updateXML

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
  if (!req.body.updateRows || !req.body.updateRows.length || req.body.updateRows.length === 0) {
    return next({
      message: 'No updateRows supplied',
    })
  }

  /**
   * Build dataTable XML
   */
  updateXML = xml.dataTable(req.body)

  /**
   * PanaxJS
   */
  panaxdb = new PanaxJS.Connection(panaxConfig.instances[panaxConfig.default_instance])

  panaxdb.setParam('userId', req.session.userId)

  panaxdb.persist(updateXML, function(err, xml) {
    if (err) {
      return next(err)
    }

    PanaxJS.Util.parseResults(xml, function(err, results) {
      if (err) {
        return next(err)
      }

      res.json({
        success: true,
        action: 'update',
        data: results,
      })
    })
  })
})
