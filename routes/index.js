var express = require('express')
var router = express.Router() // eslint-disable-line new-cap
var config = require('../config/panax.js')

/* GET home page */
router.get('/', function(req, res, next) { // eslint-disable-line no-unused-vars
  res.render('index', {
    config: config,
  })
})

module.exports = router
