var expect = require('chai').expect
var libxmljs = require('libxslt').libxmljs
var _initKeyIndexes = require('../../../../transformers/ng/json').initKeyIndexes
var _Fields = require('../../../../transformers/ng/json.fields')

describe('px-grid', function() {

  it('empty layout should return empty columnDefs', function() {
    var xml = '<Entity xmlns:px="urn:panax" controlType="gridView">' +
      '	<px:layout>' +
      '	</px:layout>' +
      '</Entity>'

    var Doc = libxmljs.parseXmlString(xml)
    var Entity = Doc.root()
    _initKeyIndexes(Entity)
    var result = _Fields.transform(Entity)

    expect(result).to.deep.equal([])
  })

  it('empty layout should return multiple columnDefs with dataTypes', function() {
    var xml = '<Entity xmlns:px="urn:panax" controlType="gridView">' +
      '	<px:fields>' +
      '		<VarChar fieldId="ID00" headerText="" fieldName="VarChar" dataType="varchar" />' +
      '		<NVarChar fieldId="ID01" headerText="" fieldName="NVarChar" dataType="nvarchar" />' +
      '		<NChar fieldId="ID02" headerText="" fieldName="NChar" dataType="nchar" />' +
      '		<Char fieldId="ID03" headerText="" fieldName="Char" dataType="char" />' +
      '		<Text fieldId="ID04" headerText="" fieldName="Text" dataType="text" />' +
      '		<Int fieldId="ID05" headerText="" fieldName="Int" dataType="int" />' +
      '		<TinyInt fieldId="ID06" headerText="" fieldName="TinyInt" dataType="tinyint" />' +
      '		<Float fieldId="ID07" headerText="" fieldName="Float" dataType="float" />' +
      '		<Money fieldId="ID08" headerText="" fieldName="Money" dataType="money" />' +
      '		<Bit fieldId="ID09" headerText="" fieldName="Bit" dataType="bit" />' +
      '		<Date fieldId="ID10" headerText="" fieldName="Date" dataType="date" />' +
      '		<Time fieldId="ID11" headerText="" fieldName="Time" dataType="time" />' +
      '		<DateTime fieldId="ID12" headerText="" fieldName="DateTime" dataType="datetime" />' +
      '		<Unknown fieldId="ID13" headerText="" fieldName="Unknown" dataType="unknown" />' +
      '	</px:fields>' +
      '	<px:layout>' +
      '		<px:field fieldId="ID00"/>' +
      '		<px:field fieldId="ID01"/>' +
      '		<px:field fieldId="ID02"/>' +
      '		<px:field fieldId="ID03"/>' +
      '		<px:field fieldId="ID04"/>' +
      '		<px:field fieldId="ID05"/>' +
      '		<px:field fieldId="ID06"/>' +
      '		<px:field fieldId="ID07"/>' +
      '		<px:field fieldId="ID08"/>' +
      '		<px:field fieldId="ID09"/>' +
      '		<px:field fieldId="ID10"/>' +
      '		<px:field fieldId="ID11"/>' +
      '		<px:field fieldId="ID12"/>' +
      '		<px:field fieldId="ID13"/>' +
      '	</px:layout>' +
      '</Entity>'

    var Doc = libxmljs.parseXmlString(xml)
    var Entity = Doc.root()
    _initKeyIndexes(Entity)
    var result = _Fields.transform(Entity)

    expect(result).to.deep.equal([{
      'field': 'VarChar',
      'displayName': '',
      'type': 'string'
    }, {
      'field': 'NVarChar',
      'displayName': '',
      'type': 'string'
    }, {
      'field': 'NChar',
      'displayName': '',
      'type': 'string'
    }, {
      'field': 'Char',
      'displayName': '',
      'type': 'string'
    }, {
      'field': 'Text',
      'displayName': '',
      'type': 'string'
    }, {
      'field': 'Int',
      'displayName': '',
      'type': 'number'
    }, {
      'field': 'TinyInt',
      'displayName': '',
      'type': 'number'
    }, {
      'field': 'Float',
      'displayName': '',
      'type': 'number'
    }, {
      'field': 'Money',
      'displayName': '',
      'type': 'number'
    }, {
      'field': 'Bit',
      'displayName': '',
      'type': 'boolean'
    }, {
      'field': 'Date',
      'displayName': '',
      'type': 'date'
    }, {
      'field': 'Time',
      'displayName': '',
      'type': 'date'
    }, {
      'field': 'DateTime',
      'displayName': '',
      'type': 'date'
    }, {
      'field': 'Unknown',
      'displayName': '',
      'type': 'object'
    }])
  })

});
