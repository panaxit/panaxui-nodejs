var express = require('express')
var router = express.Router() // eslint-disable-line new-cap
var PanaxJS = require('panaxjs')
var panaxConfig = require('../config/panax.js')

var auth = require('../lib/auth.js')
var xml = require('../transformers/xml.js')

module.exports = router

/**
 * DELETE /api/delete
 *
 * Delete Entity
 */
router.delete('/', auth.requiredAuth, function read(req, res, next) {
  var panaxdb, deleteXML

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
  if (!req.body.deleteRows || !req.body.deleteRows.length || req.body.deleteRows.length === 0) {
    return next({
      message: 'No deleteRows supplied',
    })
  }

  /**
   * Build dataTable XML
   */
  deleteXML = xml.dataTable(req.body)

  /**
   * PanaxJS
   */
  panaxdb = new PanaxJS.Connection(panaxConfig.instances[panaxConfig.default_instance])

  panaxdb.setParam('userId', req.session.userId)

  panaxdb.persist(deleteXML, function(err, xml) {
    if (err) {
      return next(err)
    }

    PanaxJS.Util.parseResults(xml, function(err, results) {
      if (err) {
        return next(err)
      }

      res.json({
        success: true,
        action: 'delete',
        data: results,
      })
    })
  })
})
