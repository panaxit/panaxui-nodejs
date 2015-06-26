var express = require('express');
var router = express.Router();
var PanaxJS = require('panaxjs');
var config = require('../config/panax.js');

var auth = require('../lib/auth.js');
var xml = require('../lib/xml.js');

module.exports = router;

/**
 * POST /api/create
 *
 * Create Entity
 */
router.post('/', auth.requiredAuth, function read(req, res, next) {
	if (!req.body.tableName)
		return next({message: "No tableName supplied"});
	if (!req.body.primaryKey || !req.body.identityKey)
		return next({message: "No primaryKey or identityKey supplied"});
	if (!req.body.dataRows || !req.body.dataRows.length || req.body.dataRows.length===0)
		return next({message: "No dataRows supplied"});

	/**
	 * Build dataTable XML
	 */
	var insertXML = xml.buildDataTable(req.body);

	/**
	 * PanaxJS
	 */
	var panaxdb = new PanaxJS.Connection(config);

	panaxdb.setParam('userId', req.session.userId);

	panaxdb.persist(insertXML, function (err, xml) {
		if(err)
			return next(err);

		panaxdb.getResults(xml, function (err, results) {
			if(err)
				return next(err);

			res.json({
				success: true,
				action: 'create',
				data: results
			});
		});
	});
});