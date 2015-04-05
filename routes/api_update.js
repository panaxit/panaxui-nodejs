var express = require('express');
var router = express.Router();
var Panax = require('panaxjs');
var config = require('../config/panax.js');

var auth = require('../lib/auth.js');
var xml = require('../lib/xml.js');

module.exports = router;

/**
 * PUT /api/update
 *
 * Update Entity
 */
router.put('/', auth.requiredAuth, function read(req, res, next) {
	if (!req.body.tableName)
		return next({message: "No tableName supplied"});
	if (!req.body.primaryKey || !req.body.identityKey)
		return next({message: "No primaryKey or identityKey supplied"});
	if (!req.body.primaryValue || !req.body.identityValue)
		return next({message: "No primaryValue or identityValue supplied"});
	if (!req.body.dataRows || !req.body.dataRows.length || req.body.dataRows.length===0)
		return next({message: "No dataRows supplied"});

	/**
	 * Build dataTable XML
	 */
	var updateXML = xml.buildDataTable(req.body);

	/**
	 * PanaxJS
	 */
	var oPanax = new Panax(config);

	oPanax.setParam('userId', req.session.userId);

	oPanax.updateDB(updateXML, function (err, xml) {
		if(err)
			return next(err);

		oPanax.getResults(xml, function (err, results) {
			if(err)
				return next(err);

			res.json({
				success: true,
				action: 'update',
				data: results
			});
		});
	});
});