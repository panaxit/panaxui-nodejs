var libxmljs = require('libxslt').libxmljs;

/*
Helpers
 */
var _helpers = require('../helpers');
var $_keys = _helpers.$keys;

/*
Transformers
 */
var _Model = require('./json.model.js');
var _Fields = require('./json.fields.js');
var _Catalog = require('./json.catalog.js');

/*
Main namespace
 */
var _Main = exports;

/*
Initialize Key Indexes
 */
_Main.initKeyIndexes = function initKeyIndexes(Entity) {
  $_keys['Fields'] = _helpers.createKeyIndex(Entity, "//px:fields/*[@fieldId]", 'fieldId');
  $_keys['Data'] = _helpers.createKeyIndex(Entity, "//px:data/px:dataRow//*[@fieldId]", 'fieldId');
}

/*
Main async function
 */
_Main.Transform = function(XMLEntity, callback) {
	if(!XMLEntity)
		return callback({ message: "Error: No XMLEntity provided" });

  var Doc = libxmljs.parseXmlString(XMLEntity);
  var Entity = Doc.root();

	_Main.initKeyIndexes(Entity);

	return callback(null, {
		"model": _Model.Transform(Entity),
		"fields": _Fields.Transform(Entity),
		"catalog": _Catalog.Transform(Entity)
	});
};