/*
Helpers
 */
var _attr = require('../helpers').attr
var _el = require('../helpers').el
var $keys = require('../helpers').$keys

/*
Transformers
 */
var _JunctionTable = require('./json.model.junctionTable')

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

  if (_attr.val(Entity, 'primaryKey')) {
    opts.primaryKey = _attr.val(Entity, 'primaryKey')
  }
  if (_attr.val(Entity, 'identityKey')) {
    opts.identityKey = _attr.val(Entity, 'identityKey')
  }

  return _Main.data(Data, opts)
}

/*
Process Data
 */
_Main.data = function(Data, opts) {
  var result = []
  var DataRows = _el.find(Data, 'px:dataRow')

  if (DataRows) {
    result = _Main.dataRows(DataRows, opts)
  }

  return result
}

/*
Process DataRows
 */
_Main.dataRows = function(DataRows, opts) {
  var records = []
  var Fields

  DataRows.forEach(function(DataRow) {
    if (_attr.val(DataRow, 'primaryValue')) {
      opts.primaryValue = _attr.val(DataRow, 'primaryValue')
    }
    if (_attr.val(DataRow, 'identity')) {
      opts.identity = _attr.val(DataRow, 'identity')
    }

    Fields = _el.find(DataRow, '*')
    records.push(_Main.fields(Fields, opts))
  })

  return records
}

/*
Process Fields
 */
_Main.fields = function(Fields, opts) {
  var column = {}

  Fields.forEach(function(Field) {
    column[_el.name(Field)] = _Main.value(Field)
  })

  if (opts.primaryValue && !column[opts.primaryKey]) {
    column[opts.primaryKey] = opts.primaryValue
  }
  if (opts.identity && !column[opts.identityKey]) {
    column[opts.identityKey] = opts.identity
  }

  return column
}

/*
Process Value
 */
_Main.value = function(Field) {
  var fieldId = _attr.val(Field, 'fieldId')
  var value = _attr.val(Field, 'value')

  var FieldMetadata = $keys.Fields[fieldId]
  var dataType = _attr.val(FieldMetadata, 'dataType')
  var controlType = _attr.val(FieldMetadata, 'controlType')

  var Entity,
    referencesItself

  switch (dataType) {
    case 'int':
      return isNaN(parseInt(value, 10)) ? null : parseInt(value, 10)
    case 'float':
    case 'money':
      return isNaN(parseFloat(value)) ? null : parseFloat(value)
    case 'bit':
      return (value === '1' || value.toLowerCase() === 'true')
    case 'date':
    case 'time':
    case 'datetime':
      return value || '' // ToDo: Parse date/time (use moments.js?)
    case 'foreignKey': {
      Entity = _el.get(FieldMetadata, '*[1]')
      referencesItself = Entity && _attr.val(Entity, 'referencesItself') || undefined
      if (referencesItself && referencesItself === 'true') {
        /*
        Foreign Key to self-ref table = Junction Table
         */
        return _JunctionTable.transform(Field, {})
      } else {
        /*
        Foreign Key to regular table
         */
        switch (controlType) {
          case 'default':
          case 'combobox':
          default:
            return value || ''
          case 'radiogroup':
            return value || ''
        }
      }
    }
    case 'foreignTable': {
      // Recursively get model of children
      Entity = _el.get(Field, '*')
      return _Main.transform(Entity)
    }
    case 'junctionTable': {
      Entity = _el.get(Field, '*')
      return _JunctionTable.transform(Entity)
    }
    default:
      return value || ''
  }
}
