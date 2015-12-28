/*
Helpers
 */
var _attr = require('../helpers').attr

/*
Includes
 */
var _PxGrid = require('./json.fields.px-grid')
var _PxCards = require('./json.fields.px-cards')
var _PxForm = require('./json.fields.px-form')

/*
Main namespace
 */
var _Main = exports

/*
Process Fields
 */
_Main.transform = function(Entity) {
  switch (_attr.val(Entity, 'controlType')) {
    case 'gridView':
      return _PxGrid.transform(Entity)
    case 'cardsView':
      return _PxCards.transform(Entity)
    case 'formView':
      return _PxForm.transform(Entity)
    case 'masterDetail':
      return {
        grid: _PxGrid.transform(Entity),
        form: _PxForm.transform(Entity),
      }
    default:
      return {}
  }
}
