var express = require('express');
var router = express.Router();
var PanaxDB = require('../lib/PanaxDB');

var libxslt = require('libxslt');
var path = require('path');
var fs = require('fs');

module.exports = router;

/**
 * GET /api/build
 *
 * Build Entity GUI
 */
router.get('/', function build(req, res, next) {
	if (!req.session.userId)
		return next({message: "Error: Not logged in"});
	if (!req.query.catalogName)
		return next({message: "Error: No catalogName supplied"});

	req.query.output = (req.query.output || 'extjs').toLowerCase(); // ExtJS is default GUI Output

	if (req.query.output != 'extjs')
		return next({message: "Error: Output '" + req.query.output + "' not supported"});

	var oPanaxDB = new PanaxDB(req.query);

	oPanaxDB.set('userId', req.session.userId);
	oPanaxDB.set('tableName', req.query.catalogName);
	oPanaxDB.set('getData', (req.query.getData || '0'));
	oPanaxDB.set('getStructure', (req.query.getStructure || '1'));
	oPanaxDB.set('lang', (req.session.lang || 'DEFAULT'));

	oPanaxDB.getXML(function (err, xml) {
		if(err)
			return next(err);

		oPanaxDB.getCatalog(xml, function (err, catalog) {
			if(err)
				return next(err);

			oPanaxDB.getFilename(catalog, function (err, exists, filename) {
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