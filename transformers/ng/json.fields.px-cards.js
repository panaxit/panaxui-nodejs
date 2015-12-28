/*
Helpers
 */
var _el = require('../helpers').el

/*
Main namespace
 */
var _Main = exports

/*
Process PxCards Fields
 */
_Main.transform = function(Entity) {
  var Layout = _el.get(Entity, 'px:layout')

  return _Main.layout(Layout)
}

_Main.layout = function() {
  return {}
}
