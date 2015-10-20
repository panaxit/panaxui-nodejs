/*
Helpers
 */
var _attr = require('../helpers').attr;
var _el = require('../helpers').el;

/*
Main namespace
 */
var _Main = exports;

/*
Process PxCards Fields
 */
_Main.Transform = function(Entity) {
  var Layout = _el.get(Entity, 'px:layout');

  return _Main.Layout(Layout);
};

_Main.Layout = function(Layout) {
	return {};
};