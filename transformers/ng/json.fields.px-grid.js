/*
Helpers
 */
var _attr = require('../helpers').attr;
var _el = require('../helpers').el;
var $_keys = require('../helpers').$keys;

/*
Main namespace
 */
var _Main = exports;

/*
Process PxGrid Fields
 */
_Main.Transform = function(Entity) {
  var Layout = _el.get(Entity, 'px:layout');

  return _Main.Layout(Layout);
};

_Main.Layout = function(Layout) {
  var result = [];

  var Fields = _el.find(Layout, 'descendant::px:field');
  if(Fields) result = _Main.Fields(Fields);

  return result;
};

_Main.Fields = function(Fields) {
	columnDefs = [];
	Fields.forEach(function (Field, index) {
		var fieldId = _attr.val(Field, 'fieldId');
		var FieldMetadata = $_keys['Fields'][fieldId];
		var column = {
			"field": _attr.val(FieldMetadata, 'fieldName'), // _el.name(FieldMetadata)
			"displayName": _attr.val(FieldMetadata, 'headerText') || '',
			/*
			ToDo: Not necesary to include type?
			...Add this only if the grid guessing is not to your satisfaction...
			http://ui-grid.info/docs/#/api/ui.grid.class:GridOptions.columnDef#type
			 */
			"type": _Main.Type(FieldMetadata)
		};
		columnDefs.push(column);
	});
	return columnDefs;
};

/*
http://ui-grid.info/docs/#/api/ui.grid.class:GridOptions.columnDef
 */
_Main.Type = function(FieldMetadata) {
	var dataType = _attr.val(FieldMetadata, 'dataType');
	var controlType = _attr.val(FieldMetadata, 'controlType');

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