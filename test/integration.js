describe('Integration tests', function() {

  describe('AngularJS', function() {

    describe('Without mocks', function() {

    	require('./integration/ng/session');

    });

    describe('Using mocks', function() {

      var fs = require('fs');
      var PanaxJS = require('panaxjs');
      var panax_config = require('../config/panax');
      var panax_instance = panax_config.instances[panax_config.default_instance];
      var panaxdb = new PanaxJS.Connection(panax_instance);

      before('mock setup & authenticate', function(done) {
        // DDL Isolation
        panaxdb.query(fs.readFileSync('test/integration/ng/mocks/mocks.clean.sql', 'utf8'), function(err) {
          if(err) return done(err);
          panaxdb.query(fs.readFileSync('test/integration/ng/mocks/mocks.prep.sql', 'utf8'), function(err) {
            if(err) return done(err);
            panaxdb.rebuildMetadata(function (err) {
              if(err) return done(err);
              done();
            });
          });
        });
      });

      require('./integration/ng/read');
      require('./integration/ng/persist');
      require('./integration/ng/tools');

    });

  });

});