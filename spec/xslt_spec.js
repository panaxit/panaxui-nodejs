/**
 * XSLT Jasmine tests
 */

describe("XSLT", function() {

	var fs = require('fs'),
		libxslt = require('libxslt'),
		xml_result = fs.readFileSync('spec/fixtures/result.xml', 'utf8');

	it("should parse XSL", function (done) {
		fs.readFile('views/xsl/sitemap.xsl', 'utf8', function (err, xsl) {
			libxslt.parse(xsl, function(err, stylesheet) {
				expect(err).toBeFalsy();
				done();
			});
		});
	});

	it("should transform XML", function (done) {
		fs.readFile('spec/fixtures/test.xsl', 'utf8', function (err, xsl) {
			libxslt.parse(xsl, function(err, stylesheet) {
				expect(err).toBeFalsy();
				fs.readFile('spec/fixtures/test.xml', 'utf8', function (err, xml) {
					stylesheet.apply(xml, function(err, result) {
						expect(err).toBeFalsy();
						if(!err) {
							expect(result).toEqual(xml_result);
						}
						console.log(result);
						done();
					});
				});
			});
		});
	});

});