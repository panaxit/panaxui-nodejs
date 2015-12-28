var express = require('express')
var router = express.Router() // eslint-disable-line new-cap

module.exports = router

/**
 * GET /api
 */
router.get('/', function(req, res, next) { // eslint-disable-line no-unused-vars
  res.render('api', {
    title: 'PanaxUI API Description',
  })
})
