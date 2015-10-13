var libxmljs = require('libxslt').libxmljs;

/*
Helpers
 */
var _attr = require('../helpers').attr;
var _el = require('../helpers').el;

/*
Includes
 */
var PxGrid = require('./json.fields.px-grid');
var PxCards = require('./json.fields.px-cards');
var PxForm = require('./json.fields.px-form');

/*
Main entry point
 */
var _Main = exports;

_Main.Transform = function(XML) {
	var Doc = libxmljs.parseXmlString(XML);
	var Entity = Doc.root();

	switch(_attr.val(Entity, 'controlType')) {
		case 'gridView': 
			return PxGrid.Transform(Entity);
		case 'cardsView': 
			return PxCards.Transform(Entity);
		case 'formView':
			return PxForm.Transform(Entity);
		case 'masterDetail':
			return {
				"grid": PxGrid.Transform(Entity),
				"form": PxForm.Transform(Entity)
			};
	}
}