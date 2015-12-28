/*
Helpers
 */
var _attr = require('../helpers').attr
var _el = require('../helpers').el
var $keys = require('../helpers').$keys

/*
Main namespace
 */
var _Main = exports

/*
Process PxGrid Fields
 */
_Main.transform = function(Entity) {
  var Layout = _el.get(Entity, 'px:layout')

  return _Main.layout(Layout)
}

_Main.layout = function(Layout) {
  var result = []
  var Fields = _el.find(Layout, 'descendant::px:field')

  if (Fields) {
    result = _Main.fields(Fields)
  }

  return result
}

_Main.fields = function(Fields) {
  var result = []

  Fields.forEach(function(Field) {
    var FieldMetadata = $keys.Fields[_attr.val(Field, 'fieldId')]
    result.push({
      field: _attr.val(FieldMetadata, 'fieldName'), // _el.name(FieldMetadata)
      headerName: _attr.val(FieldMetadata, 'headerText') || '',
    })
  })

  return result
}
