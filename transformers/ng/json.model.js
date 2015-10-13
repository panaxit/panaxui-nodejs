var libxmljs = require('libxslt').libxmljs;

/*
Helpers
 */
var _attr = require('../util').attr;
var _el = require('../util').el;
var _keyIndex = require('../util').keyIndex;

/*
Keys & Indexes
 */
var $primaryKey;
var $identityKey;
var $_FieldsIndex;

/*
Main entry point
 */
var _Main = exports;

_Main.Transform = function(XML) {
	var Doc = libxmljs.parseXmlString(XML);
	var Entity = Doc.root();

	$_FieldsIndex = _keyIndex(Entity, "px:fields/*|px:fields//*[@fieldId][not(namespace-uri(.)='urn:panax')]", 'fieldId');

	return _Main.Model(Entity);
};

/*
Process Model
 */
_Main.Model = function(Entity) {
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

	var Metadata = $_FieldsIndex[fieldId];
	var dataType = _attr.val(Metadata, 'dataType');
	var controlType = _attr.val(Metadata, 'controlType');
	var relationshipType = _attr.val(Metadata, 'relationshipType');
	
	if(dataType === 'int') {
		return parseInt(value) || null;
	} else if (dataType === 'float' || dataType === 'money') {
		return parseFloat(value) || null;
	} else if (dataType === 'bit') {
		return (value === '1' || value.toLowerCase() === 'true') ? true : false;
	} else if (dataType === 'date' || dataType === 'time' || dataType === 'datetime') {
		return value || ''; // ToDo: Parse date/time (use moments.js?)
	} else if (dataType === 'foreignKey') {
		if (controlType === 'default' || controlType === 'combobox') {
			return value || '';
		} else if (controlType === 'radiogroup') {
			return value || '';
		}
	} else if (dataType === 'foreignTable') {
		// Recursively get model of children
		var children = _el.get(Field, '*');
		return _Main.Model(children);
	} else if (dataType === 'junctionTable') {
		// ToDo
		return ''; //require('./json.model.junction.js')(.....);
	} else {
		return value || '';
	}
};