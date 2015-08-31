var express = require('express');
var router = express.Router();
var libxslt = require('libxslt');
var PanaxJS = require('panaxjs');
var config = require('../config/panax.js');

var auth = require('../lib/auth.js');
var xml = require('../lib/xml.js');

module.exports = router;

/**
 * POST /api/filters
 *
 * Get Filters
 */
router.post('/', auth.requiredAuth, function read(req, res, next) {
	if (!req.body.tableName)
		return next({message: "No tableName supplied"});
	if (!req.body.dataRows || !req.body.dataRows.length || req.body.dataRows.length===0)
		return next({message: "No dataRows supplied"});

	/**
	 * Build dataTable XML
	 */
	var filtersXML = xml.buildXMLDataTable(req.body);

	/**
	 * PanaxJS
	 */
	var panaxdb = new PanaxJS.Connection(config);

	panaxdb.setParam('userId', req.session.userId);

	libxslt.parseFile('xsl/filters.xsl', function (err, stylesheet) {
		if (err)
			return next(err);

		stylesheet.apply(filtersXML, function (err, result) {
			if (err) 
				return next(err);

			panaxdb.filters(result, function (err, filters) {
				if(err)
					return next(err);

				res.json({
					success: true,
					action: 'filters',
					data: filters
				});
			});
		});
	});
});