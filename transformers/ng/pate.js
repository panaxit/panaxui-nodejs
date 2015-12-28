var libxmljs = require('libxslt').libxmljs

/*
Transformers
 */
var _Metadata = require('./json.metadata.js')

/*
Main namespace
 */
var _Main = exports

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

  return callback(null, {
    metadata: _Metadata.transform(Entity),
  })
}
