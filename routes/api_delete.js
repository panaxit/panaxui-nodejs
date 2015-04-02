var express = require('express');
var router = express.Router();
var Panax = require('panaxjs');
var config = require('../config/panax.js');

var auth = require('../lib/auth.js');

module.exports = router;

/**
 * DELETE /api/delete
 *
 * Delete Entity
 */
router.delete('/', auth.requiredAuth, function read(req, res, next) {
	
});