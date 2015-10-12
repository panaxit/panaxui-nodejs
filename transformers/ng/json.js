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
		"model": require('./json.model.js')(XMLEntity),
		"fields": require('./json.fields.js')(XMLEntity),
		"catalog": require('./json.catalog.js')(XMLEntity)
	});
};