/**
 * XSLT pseudo-renderer module
 *  - Ugliness: err, next passing parameters
 *
 * ToDo: Create XSLT rendering engine for ExpressJS as separate module (github/panaxit/)
 * http://expressjs.com/guide/using-template-engines.html
 * http://expressjs.com/advanced/developing-template-engines.html
 * http://stackoverflow.com/questions/15063262/is-there-any-way-to-use-multiple-view-engines-with-express-node-js
 */

var fs = require('fs');
var libxslt = require('libxslt');

exports.render = function render(res, xml, path, next) {

	var xsl = fs.readFileSync('views/xsl/' + path + '.xsl', 'utf8');

	libxslt.parse(xsl, function(err, stylesheet) {
		/* Error handling for XSLT  Parsing */
		if (err) {
			return next(err);
		}
		stylesheet.apply(xml, function(err, result) {
			/* Error handling for XSLT  Transformation */
			if (err) {
				return next(err);
			}
			/* HACK: Remove first "<?xml..." line manually */
			if (result.indexOf('<?xml') == 0) {
				var tmp = result.split('\n');
				tmp.splice(0, 1);
				result = tmp.join('\n');
			}
			/* JSON Response */
			res.json(JSON.parse(result));
		});
	});
}