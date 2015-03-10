var express = require('express');
var router = express.Router();
var libxslt = require('libxslt');
var Panax = require('panaxjs');
var config = require('../config/panax.js');

var fs = require('fs');
var path = require('path');
var auth = require('../lib/auth.js');

module.exports = router;

/**
 * GET /api/build
 *
 * Build Entity GUI
 */
router.get('/', auth.requiredAuth, function build(req, res, next) {
	if (!req.query.catalogName)
		return next({message: "No catalogName supplied"});

	req.query.output = (req.query.output || 'extjs').toLowerCase(); // ExtJS is default GUI Output

	if (req.query.output != 'extjs')
		return next({message: "Output '" + req.query.output + "' not supported"});

	var oPanax = new Panax(config, req.query);

	oPanax.set('userId', req.session.userId);
	oPanax.set('tableName', req.query.catalogName);
	oPanax.set('getData', (req.query.getData || '0'));
	oPanax.set('getStructure', (req.query.getStructure || '1'));
	oPanax.set('lang', (req.session.lang || 'DEFAULT'));

	oPanax.getXML(function (err, xml) {
		if(err)
			return next(err);

		oPanax.getCatalog(xml, function (err, catalog) {
			if(err)
				return next(err);

			oPanax.getFilename(catalog, function (err, exists, filename) {
				if(exists) {
					res.json({
						success: true,
						action: "existing",
						output: req.query.output,
						filename: filename,
						catalog: catalog
					});
				} else {
					libxslt.parseFile('xsl/' + req.query.output + '/' + req.query.output + '.xsl', function (err, stylesheet) {
						if (err)
							return next(err);

						stylesheet.apply(xml, function (err, result) {
							if (err) 
								return next(err);

							fs.writeFile(filename, result, function (err) {
								if (err) 
									return next(err);
								// CONSOLE.LOG Created file: filename
								res.json({
									success: true,
									action: "built",
									filename: filename,
									output: req.query.output,
									catalog: catalog
								});
							});
						});
					});
				}
			});
		});
	});
});