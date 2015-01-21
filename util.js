/**
 * Util functions
 */
var crypto = require('crypto');

exports.md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

exports.sanitize_json_str = function(json_str) {
	// HACK: Remove first "<?xml..." line manually for non-xml outputs
	if (json_str.indexOf('<?xml') == 0) {
		var tmp = result.split('\n');
		tmp.splice(0, 1);
		json_str = tmp.join(' '); //remove newlines
	}
	return json_str;
}