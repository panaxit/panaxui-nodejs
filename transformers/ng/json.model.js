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

	$primaryKey = _attr.val(Entity, 'primaryKey');
	$identityKey = _attr.val(Entity, 'identityKey');
	$_FieldsIndex = _keyIndex(Entity, "px:fields/*|px:fields//*[@fieldId][not(namespace-uri(.)='urn:panax')]", 'fieldId');

	return _Main.Model(Entity);
};

/*
Process Model
 */
_Main.Model = function(Entity) {
	var Data = _el.get(Entity, 'px:data');
	return _Main.Data(Data);
};

/*
Process Data
 */
_Main.Data = function(Data) {
	var DataRows = _el.find(Data, 'px:dataRow');
	return _Main.DataRows(DataRows);
};

/*
Process DataRows
 */
_Main.DataRows = function(DataRows) {
	var records = [];
	DataRows.forEach(function (DataRow, index) {
		var Fields = _el.find(DataRow, '*');
		records.push(_Main.Fields(Fields));
	});
	return records;
};

/*
Process Fields
 */
_Main.Fields = function(Fields) {
	var column = {};
	Fields.forEach(function (Field, index) {
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