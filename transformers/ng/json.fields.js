/*
Helpers
 */
var _attr = require('../helpers').attr;

/*
Includes
 */
var _PxGrid = require('./json.fields.px-grid');
var _PxCards = require('./json.fields.px-cards');
var _PxForm = require('./json.fields.px-form');

/*
Main namespace
 */
var _Main = exports;

/*
Process Fields
 */
_Main.Transform = function(Entity) {
	switch(_attr.val(Entity, 'controlType')) {
		case 'gridView': 
			return _PxGrid.Transform(Entity);
		case 'cardsView': 
			return _PxCards.Transform(Entity);
		case 'formView':
			return _PxForm.Transform(Entity);
		case 'masterDetail':
			return {
				"grid": _PxGrid.Transform(Entity),
				"form": _PxForm.Transform(Entity)
			};
	}
}