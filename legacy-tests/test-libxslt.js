var fs = require('fs');
var libxslt = require('libxslt');

var xml = fs.readFileSync('menu.xml', 'utf8');
var xsl = fs.readFileSync('../xsl/sitemap.xsl', 'utf8');

libxslt.parse(xsl, function(err, stylesheet) {
	stylesheet.apply(xml, function(err, result) {
		// err contains any error from parsing the document or applying the stylesheet
		// result is a string containing the result of the transformation
		console.log(result);
	});

});