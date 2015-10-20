var libxmljs = require('libxslt').libxmljs;

/*
Helpers
 */
var _attr = require('../helpers').attr;
var _el = require('../helpers').el;

/*
Main entry point
 */
var _Main = exports;

_Main.Transform = function(XML) {
	var Doc = libxmljs.parseXmlString(XML);
	var Entity = Doc.root();

	return _Main.Catalog(Entity);
};

/*
Process Catalog
 */
_Main.Catalog = function(Entity) {
	var attrs = _el.customAttrs(Entity);

  var totalRecords = parseInt(attrs['totalRecords']),
      pageSize = parseInt(attrs['pageSize']),
      pageIndex = parseInt(attrs['pageIndex']);

	return {
		/* Basic Catalog Metadata */
		"dbId": attrs['dbId'],
		"catalogName": attrs['Table_Schema'] + '.' + attrs['Table_Name'],
		"schemaName": attrs['Table_Schema'],
		"tableName": attrs['Table_Name'],
		"mode": attrs['mode'],
		"controlType": attrs['controlType'],
		"lang": attrs['lang'],
		/* Keys & References */
		"primaryKey": attrs['primaryKey'],
		"identityKey": attrs['identityKey'],
		"foreignReference": attrs['foreignReference'],
		/* Pagination _attributes */
		"totalItems": !isNaN(totalRecords) ? totalRecords : undefined,
		"pageSize": !isNaN(pageSize) ? pageSize : undefined,
		"pageIndex": !isNaN(pageIndex) ? pageIndex : undefined,
		/* Data Access Metadata */
		"metadata": {
			"supportsInsert": attrs['supportsInsert'],
			"supportsUpdate": attrs['supportsUpdate'],
			"supportsDelete": attrs['supportsDelete'],
			"disableInsert": attrs['disableInsert'],
			"disableUpdate": attrs['disableUpdate'],
			"disableDelete": attrs['disableDelete']
		},
		"customAttrs": attrs.customAttrs
	};
};