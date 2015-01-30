var express = require('express');
var router = express.Router();
var sql = require('mssql');

var fs = require('fs');
var util = require('../util.js');
var mkdirp = require('mkdirp');
var libxslt = require('libxslt');

var panaxdb = require('../panaxdb.js');
var pate = require('node-pate');
var formatter = require('../format_lib.js');

module.exports = router;

/**
 * GET /api
 */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'PanaxUI API Description' });
});

/**
 * POST /api/login
 */
router.post('/login', function login(req, res, next) {
	if (!req.body.username)
		return next({message: "Error: Missing username"});
	if (!req.body.password)
		return next({message: "Error: Missing password"});

	sql.connect(panaxdb.config, function (err) {
		if (err)
			return next(err);

		var sql_req = new sql.Request();

		sql_req.input('username', sql.VarChar, req.body.username);
		sql_req.input('password', sql.VarChar, util.md5(req.body.password));

		sql_req.execute('[$Security].Authenticate', function (err, recordsets, returnValue) {
			if (err)
				return next(err);

			req.session.userId = recordsets[0][0].userId;
			//ToDo: oCn.execute "IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES IST WHERE routine_schema IN ('$Application') AND ROUTINE_NAME IN ('OnStartUp')) BEGIN EXEC [$Application].OnStartUp END"
			//ToDo: sqlRequest.query("...", function (err, recordset) {...

			res.json({
				success: true,
				action: 'login',
				data: {
					userId: req.session.userId
				}
			});
		});
	});
});

/**
 * GET /api/logout
 */
router.get('/logout', function logout(req, res) {
	req.session.userId = null;
	req.session.usersitemap = null;

	res.json({
		success: true,
		action: 'logout'
	});
});

/**
 * GET /api/sitemap
 */
router.get('/sitemap', function sitemap(req, res, next) {
	if (!req.session.userId)
		return next({message: "Error: Not logged in"});

	sql.connect(panaxdb.config, function (err) {
		if (err)
			return next(err);

		var sql_req = new sql.Request();

		sql_req.query("[$Security].UserSitemap @@IdUser=" + req.session.userId, function (err, recordset) {
			if (err)
				return next(err);

			libxslt.parseFile('xsl/sitemap.xsl', function (err, stylesheet) {
				if (err)
					return next(err);

				stylesheet.apply(recordset[0][''], function (err, result) {
					if (err) {
						return next(err);
					}

					res.json(JSON.parse(util.sanitizeJSONString(result)));
				});
			});
		});
	});
});

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
router.get('/build', function read(req, res, next) {
	if (!req.session.userId)
		return next({message: "Error: Not logged in"});
	if (!req.query.catalogName)
		return next({message: "Error: No catalogName supplied"});

	req.query.output = req.query.output || 'extjs'; // ExtJS is default GUI Output

	if (req.query.output.toLowerCase() != 'extjs')
		return next({message: "Error: Output '" + req.query.output + "' not supported"});

	var sql_args = [
		'@@IdUser=' + req.session.userId,
		'@TableName=' + "'" + req.query.catalogName + "'",

		'@output=' + req.query.output,
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

			var catalog = {
				dbId: xmlDoc.root().attr("dbId").value(),
				lang: xmlDoc.root().attr("lang").value(),
				Table_Schema: xmlDoc.root().attr("Table_Schema").value(),
				Table_Name: xmlDoc.root().attr("Table_Name").value(),
				mode: xmlDoc.root().attr("mode").value(),
				controlType: xmlDoc.root().attr("controlType").value()
			};

			var sLocation = [
				"cache/app",
				'/' + catalog.dbId,
				'/' + catalog.lang,
				'/' + catalog.Table_Schema,
				'/' + catalog.Table_Name,
				'/' + catalog.mode
			].join('');

			var sFileName = sLocation + '/' + catalog.controlType + '.js';

			if(fs.existsSync(sFileName) && !req.query.rebuild) { // CONSOLE.LOG Already existing file: sFileName
				res.json({
					success: true,
					action: "existing",
					filename: sFileName,
					catalog: catalog
				});
			} else { 
				// CONSOLE.LOG (Re-)Building file: sFileName
				if(fs.existsSync(sFileName))
					fs.unlinkSync(sFileName); 
				// CONSOLE.LOG Deleted file: sFileName
				if(!fs.existsSync(sLocation))
					mkdirp(sLocation);
				// CONSOLE.LOG Missing folder: sLocation
				libxslt.parseFile('xsl/' + req.query.output + '.xsl', function (err, stylesheet) {
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

/**
 * GET /api/read
 *
 * Read Entity DATA
 */
router.get('/read', function read(req, res, next) {
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

/**
 * GET /api/read_legacy
 *
 * Read Entity
 * 
 * ToDo: TO BE REMOVED
 */
// router.get('/read_legacy', function read(req, res, next) {
// 	if (!req.session.userId)
// 		return next({message: "Error: Not logged in"});
// 	if (!req.query.catalogName)
// 		return next({message: "Error: No catalogName supplied"});

// 	var output = req.query.output || 'html';
// 	var app_output = 'extjs'; // ToDo: Based on folder name
// 	var bRebuild = req.query.rebuild;
// 	var bGetData = req.query.getData;
// 	var bGetStructure = req.query.getStructure;

// 	if (output.toLowerCase() == 'html' || output.toLowerCase() == 'extjs') {
// 		bGetData = bGetData || 0;
// 		bGetStructure = bGetStructure || 0;
// 	} else if (output.toLowerCase() == 'json') {
// 		bGetData = bGetData || 1;
// 		bGetStructure = bGetStructure || 0;
// 	} else
// 		return next({message: "Error: Output '" + output + "' not supported"});

// 	var sql_args = [
// 		'@@IdUser=' + req.session.userId,
// 		'@TableName=' + "'" + req.query.catalogName + "'",
// 		'@ControlType=' + (req.query.controlType || 'DEFAULT'),
// 		'@Mode=' + (req.query.mode || 'DEFAULT'),
// 		'@PageIndex=' + (req.query.pageIndex || 'DEFAULT'),
// 		'@PageSize=' + (req.query.pageSize || 'DEFAULT'),
// 		'@MaxRecords=' + (req.query.maxRecords || 'DEFAULT'),
// 		'@Parameters=' + (req.query.parameters || 'DEFAULT'), // ToDo: Unknown
// 		'@Filters=' + (req.query.filters || 'DEFAULT'),
// 		'@Sorters=' + (req.query.sorters || 'DEFAULT'),
// 		'@FullPath=' + (req.query.fullPath || 'DEFAULT'), // ToDo: Unknown XPath
// 		'@columnList=' + 'DEFAULT', // ToDo: Unknown XML parsing for Create, Update & Delete ?
// 		'@lang=' + (req.query.lang || (req.session.lang || 'DEFAULT')),
// 		'@output=' + app_output,
// 		'@rebuild=' + (bRebuild || 'DEFAULT'),
// 		'@getData=' + bGetData,
// 		'@getStructure=' + bGetStructure
// 	];

// 	sql.connect(panaxdb.config, function (err) {
// 		if (err)
// 			return next(err);

// 		var sql_req = new sql.Request();
// 		//sql_req.verbose = true;

// 		sql_req.query('EXEC [$Ver:Beta_12].getXmlData ' + sql_args.join(', '), function (err, recordset) {
// 			if (err)
// 				return next(err);
// 			// CONSOLE.LOG EXEC [$Ver:Beta_12].getXmlData...
// 			var xmlDoc = libxslt.libxmljs.parseXml(recordset[0]['']);

// 			var sLocation = [
// 				"cache/app",
// 				'/' + xmlDoc.root().attr("dbId").value(),
// 				'/' + xmlDoc.root().attr("lang").value(),
// 				'/' + xmlDoc.root().attr("Table_Schema").value(),
// 				'/' + xmlDoc.root().attr("Table_Name").value(),
// 				'/' + xmlDoc.root().attr("mode").value()
// 			].join('');

// 			var sFileName = sLocation + [
// 				'/' + xmlDoc.root().attr("controlType").value(), '.js'
// 			].join('');

// 			if(!fs.existsSync(sLocation)) {
// 				// CONSOLE.LOG Missing folder: sLocation
// 				mkdirp(sLocation);
// 			}

// 			if(fs.existsSync(sFileName) && bRebuild) {
// 				fs.unlinkSync(sFileName);
// 				// CONSOLE.LOG Deleted file: sFileName
// 			}

// 			if(!fs.existsSync(sFileName)) {
// 				sql_args[sql_args.length-2] = '@getData=' + '0';
// 				sql_args[sql_args.length-1] = '@getStructure=' + '1';
// 			}

// 			sql_req.query('EXEC [$Ver:Beta_12].getXmlData ' + sql_args.join(', '), function (err, recordset) {
// 				if (err)
// 					return next(err);
// 				// CONSOLE.LOG EXEC [$Ver:Beta_12].getXmlData...
// 				if(!fs.existsSync(sFileName)) {

// 					libxslt.parseFile('xsl/extjs.xsl', function (err, stylesheet) { // ToDo: app_output
// 						if (err)
// 							return next(err);

// 						stylesheet.apply(recordset[0][''], function (err, result) {
// 							if (err) 
// 								return next(err);

// 							fs.writeFile(sFileName, result, function (err) {
// 								if (err) 
// 									return next(err);
// 								// CONSOLE.LOG Created file: sFileName
// 								res.json({
// 									success: true,
// 									action: "rebuild",
// 									catalog: {
// 										dbId: xmlDoc.root().attr("dbId").value(),
// 										catalogName: xmlDoc.root().attr("Table_Schema").value() + '.' + xmlDoc.root().attr("Table_Name").value(),
// 										mode: xmlDoc.root().attr("mode").value(),
// 										controlType: xmlDoc.root().attr("controlType").value(),
// 										lang: xmlDoc.root().attr("lang").value()
// 									}
// 								});
// 							});
// 						});
// 					});
// 				} else {

// 					libxslt.parseFile('xsl/json.xsl', function (err, stylesheet) {
// 						if (err)
// 							return next(err);

// 						stylesheet.apply(recordset[0][''], function (err, result) {
// 							if (err) 
// 								return next(err);

// 							res.json(JSON.parse(util.sanitizeJSONString(result)));
// 						});
// 					});
// 				}
// 			});
// 		});
// 	});
// });