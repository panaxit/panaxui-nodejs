/*
Helpers
 */
var _attr = require('../helpers').attr
var _el = require('../helpers').el

/*
Main namespace
 */
var _Main = exports

/*
Process Model
 */
_Main.transform = function(Entity) {
  var Data = _el.get(Entity, 'px:data')
  var opts = {}
  var foreignPrimaryValue,
    foreignIdentity,
    referencesItself

  if (_attr.val(Entity, 'primaryKey')) {
    opts.primaryKey = _attr.val(Entity, 'primaryKey')
  }
  if (_attr.val(Entity, 'identityKey')) {
    opts.identityKey = _attr.val(Entity, 'identityKey')
  }
  if (_attr.val(Entity, 'foreignReference')) {
    foreignPrimaryValue = _attr.val(_el.get(Entity, '../..'), 'primaryValue')
    foreignIdentity = _attr.val(_el.get(Entity, '../..'), 'identity')
    opts.foreignReference = _attr.val(Entity, 'foreignReference')
    opts.foreignValue = foreignIdentity || foreignPrimaryValue
  }
  referencesItself = _el.find(Entity, "//*[@referencesItself='true']")
  if (referencesItself) {
    opts.referencesItself = true
  }

  return _Main.data(Data, opts)
}

/*
Process Data
 */
_Main.data = function(Data, opts) {
  var DataRows

  if (!opts.referencesItself) {
    /*
    Plain
     */
    DataRows = _el.find(Data, '*')
    return _Main.dataRows(DataRows, opts)
  } else {
    /*
    Self-referencing
     */
    DataRows = _el.find(Data, '*[not(.//@foreignValue)]')
    return _Main.treeDataRows(DataRows, opts)
  }
}

/*
Process DataRows
 */
_Main.dataRows = function(DataRows, opts) {
  var records = []
  var Fields

  DataRows.forEach(function(DataRow) {
    Fields = _el.find(DataRow, '*')
    records.push({
      group: false,
      data: _Main.fields(Fields, opts),
    })
  })

  return records
}

/*
Process DataRows Recursively (as Tree)
 */
_Main.treeDataRows = function(DataRows, opts) {
  var records = []

  DataRows.forEach(function(DataRow) {
    var Fields = _el.find(DataRow, '*')
    var ownValue, ChildrenDataRows, hasChildrens, obj
    // If no children Fields, then it's a foreignKey-kind junctionTable:
    if (!Fields.length) {
      Fields = [DataRow]
    }
    ownValue = _attr.val(Fields[0], 'value')
    if (ownValue) {
      ChildrenDataRows = _el.find(DataRow, "../*[.//@foreignValue='" + ownValue + "']")
      hasChildrens = (ChildrenDataRows.length > 0)
      obj = {
        group: hasChildrens,
        data: _Main.fields(Fields, opts),
      }
      if (hasChildrens) {
        obj.expanded = true
        obj.children = _Main.treeDataRows(ChildrenDataRows, opts)
      }
      records.push(obj)
    }
  })

  return records
}

/*
Process Fields
 */
_Main.fields = function(Fields, opts) {
  var column = {}
  var ParentDataRow

  Fields.forEach(function(Field) {
    var fieldName = _attr.val(Field, 'fieldName') || _el.name(Field)
    column[fieldName] = _Main.fieldData(Field)
  })

  ParentDataRow = _el.get(Fields[0], '..')

  if (_attr.val(ParentDataRow, 'primaryValue') && !column[opts.primaryKey]) {
    column[opts.primaryKey] = _attr.val(ParentDataRow, 'primaryValue')
  }

  if (_attr.val(ParentDataRow, 'identity') && !column[opts.identityKey]) {
    column[opts.identityKey] = _attr.val(ParentDataRow, 'identity')
  }

  if (opts.foreignValue && !column[opts.foreignReference]) {
    column[opts.foreignReference] = opts.foreignValue
  }

  return column
}

/*
Process FieldData
 */
_Main.fieldData = function(Field) {
  return {
    text: _attr.val(Field, 'text'),
    value: _attr.val(Field, 'value'),
  }
}
