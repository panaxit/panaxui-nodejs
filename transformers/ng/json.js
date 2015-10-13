var Model = require('./json.model.js');
var Fields = require('./json.fields.js');
var Catalog = require('./json.catalog.js');

/*
Main function
 */
module.exports = function(XMLEntity, callback) {
	if(!XMLEntity)
		return callback({ message: "Error: No XMLEntity provided" });
	/*
	Main JSON object
	 */
	return callback(null, {
		"model": Model.Transform(XMLEntity),
		"fields": Fields(XMLEntity),
		"catalog": Catalog.Transform(XMLEntity)
	});
};