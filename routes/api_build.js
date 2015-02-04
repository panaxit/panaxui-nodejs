var express = require('express');
var router = express.Router();
var sql = require('mssql');
var panax = require('../config/panax');

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var libxslt = require('libxslt');

module.exports = router;

// ToDo from Panax.asp:
// Class_Initialize()
// - ln 26-84: Process Session Variables & Parameters
// - ln 91-100: Handle EncryptedID (eid). In different request? (ex. /to?eid=X)
// - ln 106-166: Filters: Manipulate filters
// - ln 167-169: Filters: Set identityKey filter
// - ln 172-175: Filters: Join filters
// - ln: 177-186: Sorters

/**
 * GET /api/build
 *
 * Build Entity GUI
 */
router.get('/', function read(req, res, next) {
	if (!req.session.userId)
		return next({message: "Error: Not logged in"});
	if (!req.query.catalogName)
		return next({message: "Error: No catalogName supplied"});

	output = (req.query.output || 'extjs').toLowerCase(); // ExtJS is default GUI Output

	if (output != 'extjs')
		return next({message: "Error: Output '" + output + "' not supported"});

	var sql_args = [
		'@@UserId=' + req.session.userId,
		'@TableName=' + "'" + req.query.catalogName + "'",

		'@output=' + output,
		'@rebuild=' + (req.query.rebuild || 'DEFAULT'),
		'@getData=' + (req.query.getData || '0'),
		'@getStructure=' + (req.query.getStructure || '1'),

		'@ControlType=' + (req.query.controlType || 'DEFAULT'),
		'@Mode=' + (req.query.mode || 'DEFAULT'),
		'@PageIndex=' + (req.query.pageIndex || 'DEFAULT'),
		'@PageSize=' + (req.query.pageSize || 'DEFAULT'),
		'@MaxRecords=' + (req.query.maxRecords || 'DEFAULT'),
		'@Parameters=' + (req.query.parameters || 'DEFAULT'), // ToDo: Unknown
		'@Filters=' + (req.query.filters || 'DEFAULT'),
		'@Sorters=' + (req.query.sorters || 'DEFAULT'),
		'@FullPath=' + (req.query.fullPath || 'DEFAULT'), // ToDo: Unknown XPath
		'@columnList=' + 'DEFAULT', // ToDo: Unknown XML parsing for Create, Update & Delete ?
		'@lang=' + (req.query.lang || (req.session.lang || 'DEFAULT'))
	];

	sql.connect(panax.db.config, function (err) {
		if (err)
			return next(err);

		var sql_req = new sql.Request();
		//sql_req.verbose = true;
		var sql_str = 'EXEC [$Ver:Beta_12].getXmlData ' + sql_args.join(', ');

		sql_req.query(sql_str, function (err, recordset) {
			if (err)
				return next(err);

			console.info('# /api/build - sql_str: ' + sql_str);

			var xml = recordset[0][''];

			if(!xml)
				return next({message: "Error: Missing Data XML"});

			var xmlDoc = libxslt.libxmljs.parseXml(xml);

			if(!xmlDoc)
				return next({message: "Error: Parsing XML"});

			var catalog = {
				dbId: xmlDoc.root().attr("dbId").value(),
				lang: xmlDoc.root().attr("lang").value(),
				Table_Schema: xmlDoc.root().attr("Table_Schema").value(),
				Table_Name: xmlDoc.root().attr("Table_Name").value(),
				mode: xmlDoc.root().attr("mode").value(),
				controlType: xmlDoc.root().attr("controlType").value()
			};

			var sLocation = path.join(
				panax.ui.guis[output].root,
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

				libxslt.parseFile('xsl/' + output + '.xsl', function (err, stylesheet) {
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