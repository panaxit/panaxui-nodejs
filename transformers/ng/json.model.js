/*
Helpers
 */
var _attr = require('../helpers').attr;
var _el = require('../helpers').el;
var $_keys = require('../helpers').$keys;

/*
Transformers
 */
var _JunctionTable = require('./json.model.junctionTable');

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
    column[_el.name(Field)] = _Main.Value(Field);
	});
    
  if(opts.primaryValue && !column[opts.primaryKey])
    column[opts.primaryKey] = opts.primaryValue;
  if(opts.identity && !column[opts.identityKey])
    column[opts.identityKey] = opts.identity;

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
			return isNaN(parseInt(value)) ? null : parseInt(value);
		case 'float':
		case 'money':
			return isNaN(parseFloat(value)) ? null : parseFloat(value);
		case 'bit':
			return (value === '1' || value.toLowerCase() === 'true') ? true : false;
		case 'date':
		case 'time':
		case 'datetime':
			return value || ''; // ToDo: Parse date/time (use moments.js?)
		case 'foreignKey': {
      var Entity = _el.get(Metadata, '*[1]');
      var referencesItself = Entity && _attr.val(Entity, 'referencesItself') || undefined;
      if(referencesItself && referencesItself === 'true') {
        /*
        Foreign Key to self-ref table = Junction Table
         */
        return _JunctionTable.Transform(Field, {});
      } else {;
        /*
        Foreign Key to regular table
         */
        switch(controlType) {
          case 'default':
          case 'combobox':
          default:
            return value || '';
          case 'radiogroup':
            return value || '';
        }
      }
		}
		case 'foreignTable': {
			// Recursively get model of children
			var Entity = _el.get(Field, '*');
			return _Main.Transform(Entity);
		}
		case 'junctionTable': {
      var Entity = _el.get(Field, '*');
			return _JunctionTable.Transform(Entity);
		}
		default:
			return value || '';
	}

};