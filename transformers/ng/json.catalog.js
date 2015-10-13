var libxmljs = require('libxslt').libxmljs;

/*
Helpers
 */
var _attr = require('../helpers').attr;

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
	// ToDo: Custom _attrs.
	return {
		/* Basic Catalog Metadata */
		"dbId": _attr.val(Entity, 'dbId'),
		"catalogName": _attr.val(Entity, 'Table_Schema') + '.' + _attr.val(Entity, 'Table_Name'),
		"schemaName": _attr.val(Entity, 'Table_Schema'),
		"tableName": _attr.val(Entity, 'Table_Name'),
		"mode": _attr.val(Entity, 'mode'),
		"controlType": _attr.val(Entity, 'controlType'),
		"lang": _attr.val(Entity, 'lang'),
		/* Keys & References */
		"primaryKey": _attr.val(Entity, 'primaryKey'),
		"identityKey": _attr.val(Entity, 'identityKey'),
		"foreignReference": _attr.val(Entity, 'foreignReference'),
		/* Pagination _attributes */
		"totalItems": _attr.val(Entity, 'totalRecords'),
		"pageSize": _attr.val(Entity, 'pageSize'),
		"pageIndex": _attr.val(Entity, 'pageIndex'),
		/* Data Access Metadata */
		"metadata": {
			"supportsInsert": _attr.val(Entity, 'supportsInsert'),
			"supportsUpdate": _attr.val(Entity, 'supportsUpdate'),
			"supportsDelete": _attr.val(Entity, 'supportsDelete'),
			"disableInsert": _attr.val(Entity, 'disableInsert'),
			"disableUpdate": _attr.val(Entity, 'disableUpdate'),
			"disableDelete": _attr.val(Entity, 'disableDelete')
		}
	};
};