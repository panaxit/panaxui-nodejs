/**
 * Util functions
 */
var crypto = require('crypto');
var fs = require('fs');

/**
 * md5 shortcut
 */
exports.md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
};

/**
 * Sanitize JSON before parsing
 */
exports.sanitizeJSONString = function(json_str) {
	//Remove newlines, tabs
	var tmp = json_str.split(/[\n\t]/);
	// HACK: Remove first "<?xml..." line manually for non-xml outputs
	if (json_str.indexOf('<?xml') == 0) {
		tmp.splice(0, 1);
	}
	json_str = tmp.join(' ');
	return json_str;
};

/**
 * Delete folder recursively
 */
exports.deleteFolderRecursive = function deleteFolderRecursive(path) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file, index) {
			var curPath = path + "/" + file;
			if (fs.statSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};