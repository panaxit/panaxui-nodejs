var express = require('express');
var router = express.Router();
var sql = require('mssql');
var panaxdb = require('../panaxdb.js');

var fs = require('fs');
var libxslt = require('libxslt');
var pate = require('node-pate');

var util = require('../util.js');
var formatter = require('../format_lib.js');

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
 * GET /api/read
 *
 * Read Entity DATA
 */
router.get('/', function read(req, res, next) {
	if (!req.session.userId)
		return next({message: "Error: Not logged in"});
	if (!req.query.catalogName)
		return next({message: "Error: No catalogName supplied"});

	req.query.output = req.query.output || 'json'; // JSON is default output

	if (req.query.output.toLowerCase() != 'json' && req.query.output.toLowerCase() != 'html') // ToDo: || req.query.output.toLowerCase() != 'xml'
		return next({message: "Error: Output '" + req.query.output + "' not supported"});

	var sql_args = [
		'@@IdUser=' + req.session.userId,
		'@TableName=' + "'" + req.query.catalogName + "'",

		'@output=' + req.query.output,
		'@rebuild=' + (req.query.rebuild || 'DEFAULT'),
		'@getData=' + (req.query.getData || '1'),
		'@getStructure=' + (req.query.getStructure || '0'),

		'@ControlType=' + (req.query.controlType || 'DEFAULT'),
		'@Mode=' + (req.query.mode || 'DEFAULT'),
		'@PageIndex=' + (req.query.pageIndex || 'DEFAULT'),
		'@PageSize=' + (req.query.pageSize || 'DEFAULT'),
		'@MaxRecords=' + (req.query.maxRecords || 'DEFAULT'),
		'@Parameters=' + (req.query.parameters || 'DEFAULT'), // ToDo: Unknown
		'@Filters=' + (req.query.filters || 'DEFAULT'), // ToDo: Process filters
		'@Sorters=' + (req.query.sorters || 'DEFAULT'), // ToDo: Process sorters
		'@FullPath=' + (req.query.fullPath || 'DEFAULT'), // ToDo: Unknown XPath
		'@columnList=' + 'DEFAULT', // ToDo: Unknown XML parsing for Create, Update & Delete ?
		'@lang=' + (req.query.lang || (req.session.lang || 'DEFAULT'))
	];

	sql.connect(panaxdb.config, function (err) {
		if (err)
			return next(err);

		var sql_req = new sql.Request();
		//sql_req.verbose = true;

		sql_req.query('EXEC [$Ver:Beta_12].getXmlData ' + sql_args.join(', '), function (err, recordset) {
			if (err)
				return next(err);
			// CONSOLE.LOG EXEC [$Ver:Beta_12].getXmlData...
			var xml = recordset[0][''];
			var xmlDoc = libxslt.libxmljs.parseXml(xml);

			if (xmlDoc.root().attr("controlType").value() == 'fileTemplate') {

				// STRANGE Bug when using node-pate as Express template engine:
				// 
				// res.render('templates/' + req.query.catalogName + '/' + xmlDoc.root().attr("fileTemplate").value(), {
				// 	xml: xml,
				// 	xpath: '/*/px:data/px:dataRow',
				// 	ns: {
				// 		px: 'urn:panax'
				// 	},
				// 	format_lib: formatter
				// });
				// 
				// Fixed by using pate.parse directly:
				
				pate.parse({
					tpl: fs.readFileSync('templates/' + req.query.catalogName + '/' + xmlDoc.root().attr("fileTemplate").value()),
					xml: xml,
					xpath: '/*/px:data/px:dataRow',
					ns: {
						px: 'urn:panax'
					},
					format_lib: formatter
				}, function (err, result) {
					// ToDo: Should handle content-type according to template file (ex. SVG)
					res.set('Content-Type', 'text/html');
					res.send(result);
				});
			} else {
				libxslt.parseFile('xsl/' + req.query.output + '.xsl', function (err, stylesheet) {
					if (err)
						return next(err);

					stylesheet.apply(xml, function (err, result) {
						if (err) 
							return next(err);

						if (req.query.output == 'json') {
							res.json(JSON.parse(util.sanitizeJSONString(result)));
						} else if (req.query.output == 'html') {
							res.set('Content-Type', 'text/html');
							res.send(result);
						}
					});
				});
			}
		});
	});
});