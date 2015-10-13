var libxmljs = require('libxslt').libxmljs;

/*
Helpers
 */
var _attr = require('../util').attr;

/*
Main entry point
 */
module.exports = _Catalog;

/*
Process Catalog
 */
function _Catalog(XML) {
	var Doc = libxmljs.parseXmlString(XML);
	var Entity = Doc.root();

	return _Entity(Entity);
}

/*
Process Entity
 */
function _Entity(Entity) {
	var Doc = libxmljs.parseXmlString(Entity);
	var Root = Doc.root();

	// ToDo: Custom _attrs.
	return {
		/* Basic Catalog Metadata */
		"dbId": _attr.val(Root, 'dbId'),
		"catalogName": _attr.val(Root, 'Table_Schema') + '.' + _attr.val(Root, 'Table_Name'),
		"schemaName": _attr.val(Root, 'Table_Schema'),
		"tableName": _attr.val(Root, 'Table_Name'),
		"mode": _attr.val(Root, 'mode'),
		"controlType": _attr.val(Root, 'controlType'),
		"lang": _attr.val(Root, 'lang'),
		/* Keys & References */
		"primaryKey": _attr.val(Root, 'primaryKey'),
		"identityKey": _attr.val(Root, 'identityKey'),
		"foreignReference": _attr.val(Root, 'foreignReference'),
		/* Pagination _attributes */
		"totalItems": _attr.val(Root, 'totalRecords'),
		"pageSize": _attr.val(Root, 'pageSize'),
		"pageIndex": _attr.val(Root, 'pageIndex'),
		/* Data Access Metadata */
		"metadata": {
			"supportsInsert": _attr.val(Root, 'supportsInsert'),
			"supportsUpdate": _attr.val(Root, 'supportsUpdate'),
			"supportsDelete": _attr.val(Root, 'supportsDelete'),
			"disableInsert": _attr.val(Root, 'disableInsert'),
			"disableUpdate": _attr.val(Root, 'disableUpdate'),
			"disableDelete": _attr.val(Root, 'disableDelete')
		}
	};
};