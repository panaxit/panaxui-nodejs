var expect = require('chai').expect
var libxmljs = require('libxslt').libxmljs
var _Sitemap = require('../../../../transformers/ng/sitemap')

describe('Sitemap', function() {

  describe('basic', function() {

    it('empty sitemap should return an empty array', function() {
      var xml = '<root xmlns="http://www.panaxit.com/sitemap" xml:lang="es">' +
        '</root>'

      var Doc = libxmljs.parseXmlString(xml)
      var Sitemap = Doc.root()
      var result = _Sitemap.sitemap(Sitemap)

      expect(result).to.be.empty
    })

    it('sitemap with nested menus & catalog elements', function() {
      var xml = '<root xmlns="http://www.panaxit.com/sitemap" xml:lang="es">' +
        ' <menu title="Empty Bookmarks" description="an empty bookmarks menu" expanded="true" expandable="false" categoryType="bookmarks">' +
        ' </menu>' +
        ' <catalog title="A" description="" mode="edit" controlType="cardsView" filters="[Active=1]" catalogName="[T].[A]" />' +
        ' <menu title="My Menu" description="my own">' +
        '   <catalog title="B" description="" mode="readonly" controlType="formView" identityKey="Id" id="1" catalogName="[T].[B]" />' +
        '   <catalog title="D" description="" mode="edit" controlType="cardsView" filters="[Active=1]" pageSize="4" pageIndex="3" catalogName="[T].[D]" />' +
        ' </menu>' +
        '</root>'

      var Doc = libxmljs.parseXmlString(xml)
      var Sitemap = Doc.root()
      var result = _Sitemap.sitemap(Sitemap)

      expect(result).to.be.ok
      expect(result).to.deep.equal([{
        'label': 'Empty Bookmarks',
        'expanded': true,
        'expandable': false,
        'data': {
          'description': 'an empty bookmarks menu'
        },
        'children': []
      }, {
        'label': 'A',
        'data': {
          'description': '',
          'catalogName': '[T].[A]',
          'controlType': 'cardsView',
          'mode': 'edit',
          'filters': '[Active=1]'
        }
      }, {
        'label': 'My Menu',
        'data': {
          'description': 'my own'
        },
        'children': [{
          'label': 'B',
          'data': {
            'description': '',
            'catalogName': '[T].[B]',
            'controlType': 'formView',
            'mode': 'readonly',
            'identityKey': 'Id',
            'id': '1'
          }
        }, {
          'label': 'D',
          'data': {
            'description': '',
            'catalogName': '[T].[D]',
            'controlType': 'cardsView',
            'mode': 'edit',
            'filters': '[Active=1]',
            'pageSize': 4,
            'pageIndex': 3
          }
        }]
      }])
    })

  })

});
