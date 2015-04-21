var express = require('express');
var router = express.Router();

module.exports = router;

/**
 * GET /api
 */
router.get('/', function (req, res, next) {
  res.render('api', { title: 'PanaxUI API Description' });
});