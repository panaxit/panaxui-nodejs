var expect = require('chai').expect;
var libxmljs = require('libxslt').libxmljs;
var fs = require('fs');
var _initKeyIndexes = require('../../../../transformers/ng/json').initKeyIndexes;
var _Fields = require('../../../../transformers/ng/json.fields');

describe('JSON Fields', function() {

	require('./json.fields.px-grid');
	require('./json.fields.px-cards');
	require('./json.fields.px-form');

});