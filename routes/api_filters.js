var express = require('express');
var router = express.Router();
var libxslt = require('libxslt');
var PanaxJS = require('panaxjs');
var panax_config = require('../config/panax.js');

var auth = require('../lib/auth.js');
var xml = require('../transformers/xml.js');

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
	var filtersXML = xml.dataTable(req.body);

	/**
	 * PanaxJS
	 */
	var panaxdb = new PanaxJS.Connection(panax_config.instances[panax_config.default_instance]);

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