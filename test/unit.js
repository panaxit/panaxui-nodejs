describe('Unit tests', function() {

	describe('Utilities', function() {

		require('./unit/xml');
	
	});

  describe('JS Transformers', function() {

    describe('AngularJS', function() {

  		require('./unit/transformers/helpers');

      describe('Read', function() {

  			require('./unit/transformers/ng/json.metadata');
  			require('./unit/transformers/ng/json.model');
  			require('./unit/transformers/ng/json.fields');
        require('./unit/transformers/ng/sitemap');
        require('./unit/transformers/ng/options');

      });
    
    });
  
  });

});