var express = require('express')
var router = express.Router() // eslint-disable-line new-cap
var PanaxJS = require('panaxjs')
var panaxConfig = require('../config/panax.js')

var auth = require('../lib/auth.js')
var xml = require('../transformers/xml.js')

module.exports = router

/**
 * POST /api/filters
 *
 * Get Filters
 */
router.post('/', auth.requiredAuth, function read(req, res, next) {
  var panaxdb, filtersXML, jsTransformer

  if (!req.body.tableName) {
    return next({
      message: 'No tableName supplied',
    })
  }
  if (!req.body.dataRows || !req.body.dataRows.length || req.body.dataRows.length === 0) {
    return next({
      message: 'No dataRows supplied',
    })
  }

  /**
   * Build dataTable XML
   */
  filtersXML = xml.dataTable(req.body)

  /**
   * PanaxJS
   */
  panaxdb = new PanaxJS.Connection(panaxConfig.instances[panaxConfig.default_instance])

  panaxdb.setParam('userId', req.session.userId)

  jsTransformer = require('../transformers/filters.js')
  jsTransformer.transform(filtersXML, function(err, result) {
    if (err) {
      return next(err)
    }

    panaxdb.filters(result, function(err, filters) {
      if (err) {
        return next(err)
      }

      res.json({
        success: true,
        action: 'filters',
        data: filters,
      })
    })
  })
})
