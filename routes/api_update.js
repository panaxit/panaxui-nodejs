var express = require('express');
var router = express.Router();
var PanaxJS = require('panaxjs');
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
	if (!req.body.primaryKey && !req.body.identityKey)
		return next({message: "No primaryKey or identityKey supplied"});
	if (!req.body.updateRows || !req.body.updateRows.length || req.body.updateRows.length===0)
		return next({message: "No updateRows supplied"});

	/**
	 * Build dataTable XML
	 */
	var updateXML = xml.buildXMLDataTable(req.body);

	/**
	 * PanaxJS
	 */
	var panaxdb = new PanaxJS.Connection(config);

	panaxdb.setParam('userId', req.session.userId);

	panaxdb.persist(updateXML, function (err, xml) {
		if(err)
			return next(err);

		PanaxJS.Util.parseResults(xml, function (err, results) {
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