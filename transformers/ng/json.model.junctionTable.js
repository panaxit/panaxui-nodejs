/*
Helpers
 */
var _attr = require('../helpers').attr;
var _el = require('../helpers').el;
var $_keys = require('../helpers').$keys;

/*
Globals
 */
var $fieldId;

/*
Main namespace
 */
var _Main = exports;

/*
Process Model
 */
_Main.Transform = function(Entity, opts) {
  var Data = _el.get(Entity, 'px:data');

  var opts = {};
  if(_attr.val(Entity, 'primaryKey'))
    opts.primaryKey = _attr.val(Entity, 'primaryKey');
  if(_attr.val(Entity, 'identityKey'))
    opts.identityKey = _attr.val(Entity, 'identityKey');
  if(_attr.val(Entity, 'foreignReference')) {
    var foreignPrimaryValue = _attr.val(_el.get(Entity, '../..'), 'primaryValue');
    var foreignIdentity = _attr.val(_el.get(Entity, '../..'), 'identity');
    opts.foreignReference = _attr.val(Entity, 'foreignReference');
    opts.foreignValue = foreignIdentity || foreignPrimaryValue;
  }

  return _Main.Data(Data, opts);
};

/*
Process Data
 */
_Main.Data = function(Data, opts) {
  var referencesItself = _el.find(Data, "//*[@referencesItself='true']")

  if(!referencesItself) {
    /*
    Plain
     */
    var DataRows = _el.find(Data, 'px:dataRow');
    return _Main.DataRows(DataRows, opts);
  } else {
    /*
    Self-referencing
     */
    var RootDataRows = _el.find(Data, 'px:dataRow[not(.//@foreignValue)]');
    return _Main.TreeDataRows(RootDataRows, opts);
  }
};

/*
Process DataRows
 */
_Main.DataRows = function(DataRows, opts) {
  var records = [];
  DataRows.forEach(function (DataRow, index) {
    var Fields = _el.find(DataRow, '*');
    records.push({
      "group": false,
      "data": _Main.Fields(Fields, opts)
    });
  });
  return records;
};

/*
Process DataRows Recursively (as Tree)
 */
_Main.TreeDataRows = function(DataRows, opts) {
  var records = [];
  DataRows.forEach(function (DataRow, index) {
    var Fields = _el.find(DataRow, '*');
    var ownValue = _attr.val(Fields[0], 'value');
    var ChildrenDataRows = _el.find(DataRow, "../px:dataRow[.//@foreignValue='" + ownValue + "']")
    var hasChildrens = (ChildrenDataRows.length > 0);
    var obj = {
      "group": hasChildrens,
      "data": _Main.Fields(Fields, opts)
    };
    if(hasChildrens) {
      obj.expanded = true;
      obj.children = _Main.TreeDataRows(ChildrenDataRows, opts)
    }
    records.push(obj);
  });
  return records;
};

/*
Process Fields
 */
_Main.Fields = function(Fields, opts) {
  var column = {};
  
  Fields.forEach(function (Field, index) {
    column[_el.name(Field)] = _Main.FieldData(Field);
  });

  var ParentDataRow = _el.get(Fields[0], '..');

  if(_attr.val(ParentDataRow, 'primaryValue') && !column[opts.primaryKey])
    column[opts.primaryKey] = _attr.val(ParentDataRow, 'primaryValue');

  if(_attr.val(ParentDataRow, 'identity') && !column[opts.identityKey])
    column[opts.identityKey] = _attr.val(ParentDataRow, 'identity');
 
  if(opts.foreignValue && !column[opts.foreignReference])
    column[opts.foreignReference] = opts.foreignValue;

  return column;
};

/*
Process FieldData
 */
_Main.FieldData = function(Field) {
  return {
    "text": _attr.val(Field, 'text'),
    "value": _attr.val(Field, 'value')
  };
};