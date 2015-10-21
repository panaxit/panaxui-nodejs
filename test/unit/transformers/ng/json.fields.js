var expect = require('chai').expect;
var libxmljs = require('libxslt').libxmljs;
var fs = require('fs');
var _initKeyIndexes = require('../../../../transformers/ng/json').initKeyIndexes;
var _Fields = require('../../../../transformers/ng/json.fields');

describe('JSON Fields', function() {

	require('./json.fields.px-grid');
	require('./json.fields.px-cards');
	require('./json.fields.px-form');

  describe('real mocks', function() {

    it('CONTROLS_NestedForm', function() {
      var xml = fs.readFileSync(__dirname + '/mocks/CONTROLS_NestedForm.xml');
      var fields = JSON.parse(fs.readFileSync(__dirname + '/mocks/CONTROLS_NestedForm.fields.json'));

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

      expect(result).to.deep.equal(fields);
    });

  });

});