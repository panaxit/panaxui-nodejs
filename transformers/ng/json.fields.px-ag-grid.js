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
  var result = []

  var Fields = _el.find(Layout, 'descendant::px:field');
  if(Fields) result = _Main.Fields(Fields);

  return result;
};

_Main.Fields = function(Fields) {
  result = [];
  Fields.forEach(function (Field, index) {
    var fieldId = _attr.val(Field, 'fieldId');
    var Metadata = $_keys['Fields'][fieldId];
    var column = {
      "field": _attr.val(Metadata, 'fieldName'), // _el.name(Metadata)
      "headerName": _attr.val(Metadata, 'headerText') || ''
    };
    result.push(column);
  });
  return result;
};