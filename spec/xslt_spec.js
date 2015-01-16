/**
 * XSLT Jasmine tests
 */

describe("XSLT", function() {

	var fs = require('fs'),
		libxslt = require('libxslt'),
		xml = fs.readFileSync('spec/fixtures/test.xml', 'utf8'),
		xsl = fs.readFileSync('spec/fixtures/test.xsl', 'utf8'),
		xml_result = fs.readFileSync('spec/fixtures/result.xml', 'utf8');

	it("should run", function (done) {
		libxslt.parse(xsl, function(err, stylesheet) {
			expect(err).toBeFalsy();
			done();
		});
	});

	it("should transform XML", function (done) {
		libxslt.parse(xsl, function(err, stylesheet) {
			stylesheet.apply(xml, function(err, result) {
				if(!err) {
					expect(result).toEqual(xml_result);
				}
				done();
			});
		});
	});

});