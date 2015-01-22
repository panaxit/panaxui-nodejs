/**
 * XSLT Jasmine tests
 */

describe("XSLT", function() {

	var fs = require('fs'),
		util = require('../util'), 
		libxslt = require('libxslt'),
		xml_result = fs.readFileSync('spec/fixtures/result.xml', 'utf8'),
		json_result = fs.readFileSync('spec/fixtures/result.json', 'utf8');

	it("should parse XSL", function (done) {
		fs.readFile('xsl/sitemap.xsl', 'utf8', function (err, xsl) {
			libxslt.parse(xsl, function (err, stylesheet) {
				expect(err).toBeFalsy();
				done();
			});
		});
	});

	it("should transform XML to XML", function (done) {
		fs.readFile('spec/fixtures/test_xml.xsl', 'utf8', function (err, xsl) {
			libxslt.parse(xsl, function (err, stylesheet) {
				expect(err).toBeFalsy();
				fs.readFile('spec/fixtures/test.xml', 'utf8', function (err, xml) {
					stylesheet.apply(xml, function (err, result) {
						expect(err).toBeFalsy();
						if(!err) {
							expect(result).toEqual(xml_result);
						}
						done();
					});
				});
			});
		});
	});

	it("should transform XML to JSON", function (done) {
		fs.readFile('spec/fixtures/test_json.xsl', 'utf8', function (err, xsl) {
			libxslt.parse(xsl, function (err, stylesheet) {
				expect(err).toBeFalsy();
				fs.readFile('spec/fixtures/test.xml', 'utf8', function (err, xml) {
					stylesheet.apply(xml, function (err, result) {
						expect(err).toBeFalsy();
						if(!err) {
							expect(util.sanitizeJSONString(result)).toEqual(json_result);
						}
						done();
					});
				});
			});
		});
	});

});