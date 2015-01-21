var express = require('express');
var router = express.Router();
var sql = require('mssql');
var fs = require('fs');
var mkdirp = require('mkdirp');
var libxslt = require('libxslt');
var libxmljs = require('libxmljs');
var panaxdb = require('../panaxdb.js');
var util = require('../util.js');

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
	sql.connect(panaxdb.config, function (err) {
		if (err)
			return next(err);
		if (!req.body.username || !req.body.password)
			return next({message: "Error: Missing username or password"});

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
		success: true
	});
});

/**
 * GET /api/sitemap
 */
router.get('/sitemap', function sitemap(req, res, next) {
	sql.connect(panaxdb.config, function (err) {
		if (err)
			return next(err);
		if (!req.session.userId)
			return next({message: "Error: Not logged in"});

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

					res.json(JSON.parse(util.sanitize_json_str(result)));
				});
			});
		});
	});
});

/**
 * GET /api/read
 */
router.get('/read', function read(req, res, next) {
	sql.connect(panaxdb.config, function (err) {
		if (err)
			return next(err);
		if (!req.session.userId)
			return next({message: "Error: Not logged in"});
		if (!req.query.catalogName)
			return next({message: "Error: No catalogName supplied"});

		var sql_req = new sql.Request();
		//sql_req.verbose = true;

		var sql_args = [
			'@@IdUser=' + req.session.userId,
			'@TableName=' + "'"+req.query.catalogName+"'",
			'@ControlType=' + (req.query.controlType? req.query.controlType : 'DEFAULT'),
			'@Mode=' + (req.query.mode ? req.query.mode : 'DEFAULT'),
			'@PageIndex=' + (req.query.pageIndex ? req.query.pageIndex : 'DEFAULT'),
			'@PageSize=' + (req.query.pageSize ? req.query.pageSize : 'DEFAULT'),
			'@MaxRecords=' + (req.query.maxRecords ? req.query.maxRecords : 'DEFAULT'),
			'@Parameters=' + (req.query.parameters ? req.query.parameters : 'DEFAULT'), // ToDo: Unknown
			'@Filters=' + (req.query.filters ? req.query.filters : 'DEFAULT'), // ToDo: Manipulate filters
			'@Sorters=' + (req.query.sorters ? req.query.sorters : 'DEFAULT'), // ToDo: Manipulate sorters
			'@FullPath=' + (req.query.fullPath ? req.query.fullPath : 'DEFAULT'), // ToDo: Unknown XPath
			'@columnList=' + 'DEFAULT', // ToDo: Unknown XML parsing for Create, Update & Delete ?
			'@rebuild=' + (req.query.rebuild ? req.query.rebuild : 'DEFAULT'),
			'@lang=' + (req.query.lang ? req.query.lang : (req.session.lang ? req.session.lang : 'DEFAULT'))
		];

		if (req.query.output && req.query.output == "EXTJS") {
			sql_args.push('@output=' + req.query.output); // ToDo: Based on folder name?
			sql_args.push('@getData=' + '0');
			sql_args.push('@getStructure=' + '0');
		} else {
			sql_args.push('@output=' + 'JSON'); // ToDo: Based on folder name?
			sql_args.push('@getData=' + '1');
			sql_args.push('@getStructure=' + '0');
		}

		sql_req.query('EXEC [$Ver:Beta_12].getXmlData ' + sql_args.join(', '), function (err, recordset) {
			if (err)
				return next(err);
			// CONSOLE.LOG EXEC [$Ver:Beta_12].getXmlData...
			var xmlDoc = libxmljs.parseXml(recordset[0]['']);

			var sLocation = [
				"../cache/app",
				'/' + xmlDoc.root().attr("dbId").value(),
				'/' + xmlDoc.root().attr("lang").value(),
				'/' + xmlDoc.root().attr("Table_Schema").value(),
				'/' + xmlDoc.root().attr("Table_Name").value(),
				'/' + xmlDoc.root().attr("mode").value()
			].join('');

			var sFileName = sLocation + [
				'/' + xmlDoc.root().attr("controlType").value(), '.js'
			].join('');

			// ToDo: Refactor following Sync calls

			if(!fs.existsSync(sLocation)) {
				// CONSOLE.LOG Missing folder: sLocation
				mkdirp(sLocation);
			}

			if(req.query.rebuild == "1" && fs.existsSync(sFileName)) {
				fs.unlinkSync(sFileName);
				// CONSOLE.LOG Deleted file: sFileName
			}

			if(!fs.existsSync(sFileName)) {

				sql_args[sql_args.length-2] = '@getData=' + '0';
				sql_args[sql_args.length-1] = '@getStructure=' + '1';

				sql_req.query('EXEC [$Ver:Beta_12].getXmlData ' + sql_args.join(', '), function (err, recordset) {
					if (err)
						return next(err);
					// CONSOLE.LOG EXEC [$Ver:Beta_12].getXmlData...
					libxslt.parseFile('xsl/extjs.xsl', function (err, stylesheet) {
						if (err)
							return next(err);

						stylesheet.apply(recordset[0][''], function (err, result) {
							if (err) 
								return next(err);

							fs.writeFile(sFileName, result, function (err) {
								if (err) 
									return next(err);
								// CONSOLE.LOG Created file: sFileName
								res.json({
									success: true,
									catalog: {
										dbId: xmlDoc.root().attr("dbId").value(),
										catalogName: xmlDoc.root().attr("Table_Schema").value() + '.' + xmlDoc.root().attr("Table_Name").value(),
										mode: xmlDoc.root().attr("mode").value(),
										controlType: xmlDoc.root().attr("controlType").value(),
										lang: xmlDoc.root().attr("lang").value()
									}
								});
							});
						});
					});
				});
			} else {

				sql_req.query('EXEC [$Ver:Beta_12].getXmlData ' + sql_args.join(', '), function (err, recordset) {
					if (err)
						return next(err);
					// CONSOLE.LOG EXEC [$Ver:Beta_12].getXmlData...
					libxslt.parseFile('xsl/json.xsl', function (err, stylesheet) {
						if (err)
							return next(err);

						stylesheet.apply(recordset[0][''], function (err, result) {
							if (err) 
								return next(err);

							res.json(JSON.parse(util.sanitize_json_str(result)));
						});
					});
				});
			}
		});
	});
});