var libxmljs = require('libxslt').libxmljs;

/*
Helpers
 */
var _attr = require('../helpers').attr;
var _el = require('../helpers').el;
var _keyIndex = require('../helpers').keyIndex;

/*
Keys & Indexes
 */
var $_FieldsIndex;

/*
Main entry point
 */
var _Main = exports;

_Main.Transform = function(Entity) {
	var Layout = _el.get(Entity, 'px:layout');

	$_FieldsIndex = _keyIndex(Entity, "px:fields//*[@fieldId]", 'fieldId');

	return _Main.Layout(Layout);
};

_Main.Layout = function(Layout) {
	var Fields = _el.find(Layout, '//px:field');
	return {
		"columnDefs": _Main.Fields(Fields)
	};
};

_Main.Fields = function(Fields) {
	columnDefs = [];
	Fields.forEach(function (Field, index) {
		var fieldId = _attr.val(Field, 'fieldId');
		var Metadata = $_FieldsIndex[fieldId];
		var column = {
			"field": _attr.val(Metadata, 'fieldName'), // _el.name(Metadata)
			"displayName": _attr.val(Metadata, 'headerText'),
			/*
			ToDo: Not necesary to include type?
			...Add this only if the grid guessing is not to your satisfaction...
			http://ui-grid.info/docs/#/api/ui.grid.class:GridOptions.columnDef#type
			 */
			"type": _Main.Type(Metadata)
		};
		columnDefs.push(column);
	});
	return columnDefs;
};

/*
http://ui-grid.info/docs/#/api/ui.grid.class:GridOptions.columnDef
 */
_Main.Type = function(Metadata) {
	var dataType = _attr.val(Metadata, 'dataType');
	var controlType = _attr.val(Metadata, 'controlType');

	switch(dataType) {
		case 'varchar':
		case 'nvarchar':
		case 'nchar':
		case 'char':
		case 'text':
			return 'string';
		case 'int':
		case 'tinyint':
		case 'money':
		case 'float':
			return 'number';
		case 'bit':
			return 'boolean';
		case 'date':
		case 'time':
		case 'datetime':
			return 'date';
		default:
			return 'object';
	}

}