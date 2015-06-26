var express = require('express');
var router = express.Router();
var PanaxJS = require('panaxjs');
var config = require('../config/panax.js');

var auth = require('../lib/auth.js');
var xml = require('../lib/xml.js');

module.exports = router;

/**
 * DELETE /api/delete
 *
 * Delete Entity
 */
router.delete('/', auth.requiredAuth, function read(req, res, next) {
	if (!req.body.tableName)
		return next({message: "No tableName supplied"});
	if (!req.body.primaryKey || !req.body.identityKey)
		return next({message: "No primaryKey or identityKey supplied"});
	if (!req.body.deleteRows || !req.body.deleteRows.length || req.body.deleteRows.length===0)
		return next({message: "No deleteRows supplied"});

	/**
	 * Build dataTable XML
	 */
	var deleteXML = xml.buildDataTable(req.body);

	/**
	 * PanaxJS
	 */
	var panaxdb = new PanaxJS.Connection(config);

	panaxdb.setParam('userId', req.session.userId);

	panaxdb.persist(deleteXML, function (err, xml) {
		if(err)
			return next(err);

		panaxdb.getResults(xml, function (err, results) {
			if(err)
				return next(err);

			res.json({
				success: true,
				action: 'delete',
				data: results
			});
		});
	});
});