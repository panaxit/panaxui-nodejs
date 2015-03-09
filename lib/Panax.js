/**
 * Panax.js
 * 
 * PanaxDB Abstraction Class
 *
 * HowTo instantiate:
 *
 * var PanaxJS = new require('PanaxJS')(options);
 * 
 */
var sql = require('mssql');
var libxmljs = require('libxslt').libxmljs;
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

// ToDo
// @Parameters (Unknown)
// @FullPath (Unknown XPath)
// @ColumnList (Unknown XML parsing for Create, Update & Delete ?)
//
// ToDo from Panax.asp:
// Class_Initialize()
// - ln 26-84: Process Session Variables & Parameters
// - ln 91-100: Handle EncryptedID (eid). In different request? (ex. /to?eid=X)
// - ln 106-166: Filters: Manipulate filters
// - ln 167-169: Filters: Set identityKey filter
// - ln 172-175: Filters: Join filters
// - ln: 177-186: Sorters

/**
 * Constructor
 */
var Class = function(config, options) {
	
	this.config = config;

	if(!options) {
		this.options = {};
	} else {
		this.options = {
			userId: options.userId,
			tableName: options.tableName,
			output: options.output,
			getData: options.getData || '1',
			getStructure: options.getStructure || '1',
			rebuild: options.rebuild || 'DEFAULT',
			controlType: options.controlType || 'DEFAULT',
			mode: options.mode || 'DEFAULT',
			pageIndex: options.pageIndex || 'DEFAULT',
			pageSize: options.pageSize || 'DEFAULT',
			maxRecords: options.maxRecords || 'DEFAULT',
			parameters: options.parameters || 'DEFAULT',
			filters: options.filters || 'DEFAULT',
			sorters: options.sorters || 'DEFAULT',
			fullPath: options.fullPath || 'DEFAULT',
			columnList: options.columnList || 'DEFAULT',
			lang: options.lang || 'DEFAULT'
		};
	}
};

/**
 * Property setter
 */
Class.prototype.set = function(prop, value) {
	if (this.options.hasOwnProperty(prop)) {
		this.options[prop] = value;
	}
};

/**
 * To Array
 */
Class.prototype.toArray = function() {
	var result = [];
	var prefix = '@';
	var quote = '';

	for (var prop in this.options) {
		prefix = (prop !== 'userId') ? '@' : '@@';
		quote = (prop !== 'tableName') ? '' : '\'';
		result.push(prefix + prop + '=' + quote + this.options[prop] + quote);
	}

	return result;
};

/**
 * To String
 */
Class.prototype.toString = function() {
	return this.toArray().join(', ');
};

/**
 * Get Vendor Info
 */
Class.prototype.getVendorInfo = function(callback) {
	var that = this;

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = 'SELECT @@version as version';

		sql_req.query(sql_str, function (err, recordset) {
			if (err)
				return callback(err);

			console.info('# PanaxJS - sql_str: ' + sql_str);

			if(!recordset[0])
				return callback({message: "Error: Missing Vendor Info"});

			callback(null, recordset[0]);
		});
	});
};

/**
 * Wrapper for SQL Procedure:
 * [$PanaxDB].Authenticate
 */
Class.prototype.authenticate = function(username, password, callback) {
	var that = this;

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = '[$Security].Authenticate';

		sql_req.input('username', sql.VarChar, username);
		sql_req.input('password', sql.VarChar, password);

		sql_req.execute(sql_str, function (err, recordsets, returnValue) {
			if (err)
				return callback(err);

			console.info('# PanaxJS - sql_str: ' + sql_str);

			var userId = recordsets[0][0].userId;
			//ToDo: oCn.execute "IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES IST WHERE routine_schema IN ('$Application') AND ROUTINE_NAME IN ('OnStartUp')) BEGIN EXEC [$Application].OnStartUp END"

			callback(null, userId);
		});
	});
};

/**
 * Wrapper for SQL Query:
 * [$PanaxDB].UserSitemap
 */
Class.prototype.getSitemap = function(callback) {
	var that = this;

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = '[$Security].UserSitemap @@userId=' + that.options.userId;

		sql_req.query(sql_str, function (err, recordset) {
			if (err)
				return callback(err);

			console.info('# PanaxJS - sql_str: ' + sql_str);

			var xml = recordset[0]['userSiteMap'];

			if(!xml)
				return callback({message: "Error: Missing Sitemap XML"});

			callback(null, xml);
		});
	});
};

/**
 * Wrapper for SQL Query:
 * [$PanaxDB].getXmlData
 */
Class.prototype.getXML = function(callback) {
	var that = this;

	sql.connect(that.config.db, function (err) {
		if (err)
			return callback(err);

		var sql_req = new sql.Request();
		var sql_str = 'EXEC [$Ver:' + that.config.db.version + '].getXmlData ' + that.toString();

		sql_req.query(sql_str, function (err, recordset) {
			if (err)
				return callback(err);

			console.info('# PanaxJS - sql_str: ' + sql_str);

			var xml = recordset[0][''];

			if(!xml)
				return callback({message: "Error: Missing XML Data"});

			callback(null, xml);
		});
	});
};

/**
 * Get Catalog object from XML
 */
Class.prototype.getCatalog = function(xml, callback) {
	var xmlDoc = libxmljs.parseXml(xml); // Sync func

	if(!xmlDoc)
		return callback({message: "Error: Parsing XML"});

	var catalog = {
		dbId: xmlDoc.root().attr("dbId").value(),
		lang: xmlDoc.root().attr("lang").value(),
		Table_Schema: xmlDoc.root().attr("Table_Schema").value(),
		Table_Name: xmlDoc.root().attr("Table_Name").value(),
		mode: xmlDoc.root().attr("mode").value(),
		controlType: xmlDoc.root().attr("controlType").value()
	};

	var fileTemplate = xmlDoc.root().attr("fileTemplate");
	if(fileTemplate)
		catalog.fileTemplate = fileTemplate.value();

	callback(null, catalog);
};

Class.prototype.getFilename = function(catalog, callback) {
	var sLocation = path.join(
		this.config.ui.guis[this.options.output].cache,
		catalog.dbId,
		catalog.lang,
		catalog.Table_Schema,
		catalog.Table_Name,
		catalog.mode
	);

	var sFileName = path.join(sLocation, catalog.controlType + '.js');

	// ToDo: Use Async functions?
	if(fs.existsSync(sFileName) && this.options.rebuild !== '1') {
		console.info('# PanaxJS - Existing file: ' + sFileName);
		callback(null, true, sFileName);
	} else {
		if(fs.existsSync(sFileName)) {
			fs.unlinkSync(sFileName);
			console.info('# PanaxJS - Deleted file: ' + sFileName);
		}
		if(!fs.existsSync(sLocation)) {
			mkdirp(sLocation);
			console.info('# PanaxJS - Mkdirp folder: ' + sLocation);
		}

		console.info('# PanaxJS - Missing file: ' + sFileName);
		callback(null, false, sFileName);
	}
};

// node.js module export
module.exports = Class;
