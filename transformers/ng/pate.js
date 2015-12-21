var libxmljs = require('libxslt').libxmljs;

/*
Transformers
 */
var _Metadata = require('./json.metadata.js');

/*
Main namespace
 */
var _Main = exports;

/*
Main async function
 */
_Main.Transform = function(XMLEntity, callback) {
  if(!XMLEntity)
    return callback({ message: "Error: No XMLEntity provided" });

  var Doc = libxmljs.parseXmlString(XMLEntity);
  var Entity = Doc.root();

  return callback(null, {
    "metadata": _Metadata.Transform(Entity)
  });
};