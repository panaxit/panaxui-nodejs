var expect = require('chai').expect;
var libxmljs = require('libxslt').libxmljs;
var fs = require('fs');
var _initKeyIndexes = require('../../../../transformers/ng/json').initKeyIndexes;
var _Fields = require('../../../../transformers/ng/json.fields');

describe('JSON Fields', function() {

  describe('real mocks', function() {

    var mocks = [
      'CONTROLS_NestedForm',
      'CONTROLS_Basic'
    ];

    mocks.forEach(function (mock, index) {
      it(mock, function() {
        var xml = fs.readFileSync(__dirname + '/mocks/' + mock + '.xml');
        var fields = JSON.parse(fs.readFileSync(__dirname + '/mocks/' + mock + '.fields.json'));

        var Doc = libxmljs.parseXmlString(xml);
        var Entity = Doc.root();
        _initKeyIndexes(Entity);
        var result = _Fields.Transform(Entity);

        expect(result).not.to.be.empty;
        expect(result).to.deep.equal(fields);
      });
    });

  });

	require('./json.fields.px-grid');
	require('./json.fields.px-cards');
	require('./json.fields.px-form');

});