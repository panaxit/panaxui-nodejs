var expect = require('chai').expect;
var libxmljs = require('libxslt').libxmljs;
var _Fields = require('../../../../transformers/ng/json.fields');

describe('px-cards', function() {

	it('Not using Fields ATM');

  it('empty layout should return empty object', function() {
    var xml = '<Entity xmlns:px="urn:panax" controlType="cardsView">' +
              ' <px:layout>' +
              ' </px:layout>' +
              '</Entity>';

    var Doc = libxmljs.parseXmlString(xml);
    var Entity = Doc.root();
    var result = _Fields.Transform(Entity);

    expect(result).to.deep.equal({});
  });
	
});