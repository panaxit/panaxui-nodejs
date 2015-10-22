var expect = require('chai').expect;
var libxmljs = require('libxslt').libxmljs;
var _Options = require('../../../../transformers/ng/options');

describe('Options', function() {

  describe('basic', function() {

    it('should return an empty array when empty options', function() {
      var xml = '<options>' +
                '</options>';

      var Doc = libxmljs.parseXmlString(xml);
      var Options = Doc.root();
      var result = _Options.Options(Options);

      expect(result).to.be.empty;
    });

    it('should return options', function() {
      var xml = '<options>' +
                ' <option value="A" text="Option A"/>' +
                ' <option value="B" text="Option B"/>' +
                '</options>';

      var Doc = libxmljs.parseXmlString(xml);
      var Options = Doc.root();
      var result = _Options.Options(Options);

      expect(result).to.be.deep.equal([
        {"value": "A", "label":"Option A"},
        {"value": "B", "label":"Option B"}
      ]);
    });

    it('should return null option when allowing nulls', function() {
      var xml = '<options allowNulls="true">' +
                ' <option value="B" text="Option B"/>' +
                '</options>';

      var Doc = libxmljs.parseXmlString(xml);
      var Options = Doc.root();
      var result = _Options.Options(Options);

      expect(result).to.be.deep.equal([
        {"value": null, "label":"- -"},
        {"value": "B", "label":"Option B"}
      ]);
    });

  });

});