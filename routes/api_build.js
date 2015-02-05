var express = require('express');
var router = express.Router();
var PanaxJS = require('../../PanaxJS');
var panax_config = require('../config/panax');

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var libxslt = require('libxslt');

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

	var oPanaxJS = new PanaxJS(req.query);

	oPanaxJS.set('userId', req.session.userId);
	oPanaxJS.set('tableName', req.query.catalogName);
	oPanaxJS.set('getData', (req.query.getData || '0'));
	oPanaxJS.set('getStructure', (req.query.getStructure || '1'));
	oPanaxJS.set('lang', (req.session.lang || 'DEFAULT'));
	oPanaxJS.setConfig(panax_config);

	oPanaxJS.getXML(function (err, xml) {
		if(err)
			return next(err);

		oPanaxJS.getCatalog(xml, function (err, catalog) {
			if(err)
				return next(err);

			var sLocation = path.join(
				panax_config.ui.guis[req.query.output].root,
				"cache", "app",
				catalog.dbId,
				catalog.lang,
				catalog.Table_Schema,
				catalog.Table_Name,
				catalog.mode
			);

			var sFileName = path.join(sLocation, catalog.controlType + '.js');

			// ToDo: Use Async functions?
			if(fs.existsSync(sFileName) && !req.query.rebuild) {
				console.info('# /api/build - Already existing file: ' + sFileName);
				res.json({
					success: true,
					action: "existing",
					filename: sFileName,
					catalog: catalog
				});
			} else {
				if(fs.existsSync(sFileName)) {
					fs.unlinkSync(sFileName);
					console.info('# /api/build - Deleted file: ' + sFileName);
				}

				console.info('# /api/build - Building file: ' + sFileName);

				if(!fs.existsSync(sLocation)) {
					mkdirp(sLocation);
					console.info('# /api/build - Mkdirp folder: ' + sLocation);
				}

				var xsl_path = path.join(__dirname, '..', 'xsl', req.query.output + '.xsl');

				libxslt.parseFile(xsl_path, function (err, stylesheet) {
					if (err)
						return next(err);

					stylesheet.apply(xml, function (err, result) {
						if (err) 
							return next(err);

						fs.writeFile(sFileName, result, function (err) {
							if (err) 
								return next(err);
							// CONSOLE.LOG Created file: sFileName
							res.json({
								success: true,
								action: "built",
								filename: sFileName,
								catalog: catalog
							});
						});
					});
				});
			}
		});
	});
});