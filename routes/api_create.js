var express = require('express');
var router = express.Router();
var PanaxJS = require('panaxjs');
var panax_config = require('../config/panax.js');

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
	if (!req.body.primaryKey && !req.body.identityKey)
		return next({message: "No primaryKey or identityKey supplied"});
	if (!req.body.insertRows || !req.body.insertRows.length || req.body.insertRows.length===0)
		return next({message: "No insertRows supplied"});

	/**
	 * Build dataTable XML
	 */
	var insertXML = xml.buildXMLDataTable(req.body);

	/**
	 * PanaxJS
	 */
	var panaxdb = new PanaxJS.Connection(panax_config.instances[panax_config.default_instance]);

	panaxdb.setParam('userId', req.session.userId);

	panaxdb.persist(insertXML, function (err, xml) {
		if(err)
			return next(err);

		PanaxJS.Util.parseResults(xml, function (err, results) {
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