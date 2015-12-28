describe('Unit tests', function() {

  describe('JS Transformers', function() {

    require('./unit/transformers/helpers')
    require('./unit/transformers/xml')
    require('./unit/transformers/filters')

    describe('AngularJS', function() {

      require('./unit/transformers/ng/json.metadata')
      require('./unit/transformers/ng/json.model')
      require('./unit/transformers/ng/json.fields')
      require('./unit/transformers/ng/sitemap')
      require('./unit/transformers/ng/options')

    })

  })

});
