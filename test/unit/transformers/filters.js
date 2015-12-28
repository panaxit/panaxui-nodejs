var expect = require('chai').expect
var libxmljs = require('libxslt').libxmljs
var _Filters = require('../../../transformers/filters')

describe('Filters', function() {

  describe('basic', function() {

    it('should use "=" operator for numeric fields', function() {
      var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<dataTable name="[dbo].[CONTROLS_Basic]" identityKey="Id">' +
        '<dataRow>' +
        '<field name="IntegerReq">2</field>' +
        '</dataRow>' +
        '</dataTable>'

      var output = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<dataTable name="[dbo].[CONTROLS_Basic]" identityKey="Id">' +
        '<filterGroup operator="AND">' +
        '<dataField name="IntegerReq">' +
        '<filterGroup operator="=">' +
        '<dataValue>2</dataValue>' +
        '</filterGroup>' +
        '</dataField>' +
        '</filterGroup>' +
        '</dataTable>'

      var Doc = libxmljs.parseXmlString(xml)
      var Filters = Doc.root()
      var result = _Filters.filters(Filters)

      var xml_doc = libxmljs.parseXml(result)
      var xmlOutput = libxmljs.parseXml(output)

      expect(xml_doc.toString()).to.equal(xmlOutput.toString())
    })

    it('should use "LIKE" operator for text fields', function() {
      var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<dataTable name="[dbo].[CONTROLS_Basic]" identityKey="Id">' +
        '<dataRow>' +
        '<field name="ShortTextField">\'\'a\'\'</field>' +
        '</dataRow>' +
        '</dataTable>'

      var output = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<dataTable name="[dbo].[CONTROLS_Basic]" identityKey="Id">' +
        '<filterGroup operator="AND">' +
        '<dataField name="ShortTextField">' +
        '<filterGroup operator="LIKE">' +
        '<dataValue>\'\'a\'\'</dataValue>' +
        '</filterGroup>' +
        '</dataField>' +
        '</filterGroup>' +
        '</dataTable>'

      var Doc = libxmljs.parseXmlString(xml)
      var Filters = Doc.root()
      var result = _Filters.filters(Filters)

      var xml_doc = libxmljs.parseXml(result)
      var xmlOutput = libxmljs.parseXml(output)

      expect(xml_doc.toString()).to.equal(xmlOutput.toString())
    })

    it('should combine multiple fields', function() {
      var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<dataTable name="[dbo].[CONTROLS_Basic]" identityKey="Id">' +
        '<dataRow>' +
        '<field name="ShortTextField">\'\'a\'\'</field>' +
        '<field name="IntegerReq">2</field>' +
        '</dataRow>' +
        '</dataTable>'

      var output = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<dataTable name="[dbo].[CONTROLS_Basic]" identityKey="Id">' +
        '<filterGroup operator="AND">' +
        '<dataField name="ShortTextField">' +
        '<filterGroup operator="LIKE">' +
        '<dataValue>\'\'a\'\'</dataValue>' +
        '</filterGroup>' +
        '</dataField>' +
        '<dataField name="IntegerReq">' +
        '<filterGroup operator="=">' +
        '<dataValue>2</dataValue>' +
        '</filterGroup>' +
        '</dataField>' +
        '</filterGroup>' +
        '</dataTable>'

      var Doc = libxmljs.parseXmlString(xml)
      var Filters = Doc.root()
      var result = _Filters.filters(Filters)

      var xml_doc = libxmljs.parseXml(result)
      var xmlOutput = libxmljs.parseXml(output)

      expect(xml_doc.toString()).to.equal(xmlOutput.toString())
    })

  })

});
