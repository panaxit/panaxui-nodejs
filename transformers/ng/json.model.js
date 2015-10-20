/*
Helpers
 */
var _attr = require('../helpers').attr;
var _el = require('../helpers').el;
var $_keys = require('../helpers').$keys;

/*
Globals
 */
var $primaryKey;
var $identityKey;

/*
Main namespace
 */
var _Main = exports;

/*
Process Model
 */
_Main.Transform = function(Entity) {
	var Data = _el.get(Entity, 'px:data');

	var opts = {};
	if(_attr.val(Entity, 'primaryKey'))
		opts.primaryKey = _attr.val(Entity, 'primaryKey');
	if(_attr.val(Entity, 'identityKey'))
		opts.identityKey = _attr.val(Entity, 'identityKey');

	return _Main.Data(Data, opts);
};

/*
Process Data
 */
_Main.Data = function(Data, opts) {
	var DataRows = _el.find(Data, 'px:dataRow');
	return _Main.DataRows(DataRows, opts);
};

/*
Process DataRows
 */
_Main.DataRows = function(DataRows, opts) {
	var records = [];
	DataRows.forEach(function (DataRow, index) {
		if(_attr.val(DataRow, 'primaryValue'))
			opts.primaryValue = _attr.val(DataRow, 'primaryValue');
		if(_attr.val(DataRow, 'identity'))
			opts.identity = _attr.val(DataRow, 'identity');

		var Fields = _el.find(DataRow, '*');
		records.push(_Main.Fields(Fields, opts));
	});
	return records;
};

/*
Process Fields
 */
_Main.Fields = function(Fields, opts) {
	var column = {};
	Fields.forEach(function (Field, index) {
		if(opts.primaryValue)
			column[opts.primaryKey] = opts.primaryValue;
		if(opts.identity)
			column[opts.identityKey] = opts.identity;

		column[_el.name(Field)] = _Main.Value(Field);
	});
	return column;
};

/*
Process Value
 */
_Main.Value = function(Field) {
	var fieldId = _attr.val(Field, 'fieldId');
	var value = _attr.val(Field, 'value');

	var Metadata = $_keys['Fields'][fieldId];
	var dataType = _attr.val(Metadata, 'dataType');
	var controlType = _attr.val(Metadata, 'controlType');
	var relationshipType = _attr.val(Metadata, 'relationshipType');
	
	switch(dataType) {
		case 'int':
			return parseInt(value) || null;
		case 'float':
		case 'money':
			return parseFloat(value) || null;
		case 'bit':
			return (value === '1' || value.toLowerCase() === 'true') ? true : false;
		case 'date':
		case 'time':
		case 'datetime':
			return value || ''; // ToDo: Parse date/time (use moments.js?)
		case 'foreignKey': {
			switch(controlType) {
				case 'default':
				case 'combobox':
				default:
					return value || '';
				case 'radiogroup':
					return value || '';
			}
		}
		case 'foreignTable': {
			// Recursively get model of children
			var children = _el.get(Field, '*');
			return _Main.Transform(children);
		}
		case 'junctionTable': {
			// ToDo
			return ''; //require('./json.model.junction.js')(.....);
		}
		default:
			return value || '';
	}

};