/**
 * GET /api/read_legacy
 *
 * Read Entity
 * 
 * ToDo: TO BE REMOVED
 */
router.get('/read_legacy', function read(req, res, next) {
	if (!req.session.userId)
		return next({message: "Error: Not logged in"});
	if (!req.query.catalogName)
		return next({message: "Error: No catalogName supplied"});

	var output = req.query.output || 'html';
	var app_output = 'extjs'; // ToDo: Based on folder name
	var bRebuild = req.query.rebuild;
	var bGetData = req.query.getData;
	var bGetStructure = req.query.getStructure;

	if (output.toLowerCase() == 'html' || output.toLowerCase() == 'extjs') {
		bGetData = bGetData || 0;
		bGetStructure = bGetStructure || 0;
	} else if (output.toLowerCase() == 'json') {
		bGetData = bGetData || 1;
		bGetStructure = bGetStructure || 0;
	} else
		return next({message: "Error: Output '" + output + "' not supported"});

	var sql_args = [
		'@@IdUser=' + req.session.userId,
		'@TableName=' + "'" + req.query.catalogName + "'",
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
		'@lang=' + (req.query.lang || (req.session.lang || 'DEFAULT')),
		'@output=' + app_output,
		'@rebuild=' + (bRebuild || 'DEFAULT'),
		'@getData=' + bGetData,
		'@getStructure=' + bGetStructure
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
			var xmlDoc = libxslt.libxmljs.parseXml(recordset[0]['']);

			var sLocation = [
				"cache/app",
				'/' + xmlDoc.root().attr("dbId").value(),
				'/' + xmlDoc.root().attr("lang").value(),
				'/' + xmlDoc.root().attr("Table_Schema").value(),
				'/' + xmlDoc.root().attr("Table_Name").value(),
				'/' + xmlDoc.root().attr("mode").value()
			].join('');

			var sFileName = sLocation + [
				'/' + xmlDoc.root().attr("controlType").value(), '.js'
			].join('');

			if(!fs.existsSync(sLocation)) {
				// CONSOLE.LOG Missing folder: sLocation
				mkdirp(sLocation);
			}

			if(fs.existsSync(sFileName) && bRebuild) {
				fs.unlinkSync(sFileName);
				// CONSOLE.LOG Deleted file: sFileName
			}

			if(!fs.existsSync(sFileName)) {
				sql_args[sql_args.length-2] = '@getData=' + '0';
				sql_args[sql_args.length-1] = '@getStructure=' + '1';
			}

			sql_req.query('EXEC [$Ver:Beta_12].getXmlData ' + sql_args.join(', '), function (err, recordset) {
				if (err)
					return next(err);
				// CONSOLE.LOG EXEC [$Ver:Beta_12].getXmlData...
				if(!fs.existsSync(sFileName)) {

					libxslt.parseFile('xsl/extjs.xsl', function (err, stylesheet) { // ToDo: app_output
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
									action: "rebuild",
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
				} else {

					libxslt.parseFile('xsl/json.xsl', function (err, stylesheet) {
						if (err)
							return next(err);

						stylesheet.apply(recordset[0][''], function (err, result) {
							if (err) 
								return next(err);

							res.json(JSON.parse(util.sanitizeJSONString(result)));
						});
					});
				}
			});
		});
	});
});