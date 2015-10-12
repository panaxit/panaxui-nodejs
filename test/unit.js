describe('Unit tests', function() {

	describe('Utilities', function() {

		require('./unit/xml');
	
	});

	describe.only('Transformers', function() {

		require('./unit/transformers/util');
		require('./unit/transformers/ng/json.catalog');
	
	});

});