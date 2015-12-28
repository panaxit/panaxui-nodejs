var libxmljs = require('libxslt').libxmljs

/*
Helpers
 */
var _helpers = require('../helpers')
var $keys = _helpers.$keys

/*
Transformers
 */
var _Model = require('./json.model.js')
var _Fields = require('./json.fields.js')
var _Metadata = require('./json.metadata.js')

/*
Main namespace
 */
var _Main = exports

/*
Initialize Key Indexes
 */
_Main.initKeyIndexes = function initKeyIndexes(Entity) {
  $keys.Fields = _helpers.createKeyIndex(Entity, '//px:fields/*[@fieldId]', 'fieldId')
  $keys.Data = _helpers.createKeyIndex(Entity, '//px:data/px:dataRow//*[@fieldId]', 'fieldId')
}

/*
Main async function
 */
_Main.transform = function(XMLEntity, callback) {
  var Doc, Entity

  if (!XMLEntity) {
    return callback({
      message: 'Error: No XMLEntity provided',
    })
  }

  Doc = libxmljs.parseXmlString(XMLEntity)
  Entity = Doc.root()

  _Main.initKeyIndexes(Entity)

  return callback(null, {
    model: _Model.transform(Entity),
    fields: _Fields.transform(Entity),
    metadata: _Metadata.transform(Entity),
  })
}
