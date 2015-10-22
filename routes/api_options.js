var express = require('express');
var router = express.Router();
var libxslt = require('libxslt');
var PanaxJS = require('panaxjs');
var panax_config = require('../config/panax.js');

var fs = require('fs');
var util = require('../lib/util.js');
var auth = require('../lib/auth.js');

module.exports = router;

/**
 * GET /api/options
 *
 * Get OPTIONS
 */
router.get('/', auth.requiredAuth, function options(req, res, next) {
	if (!req.query.catalogName)
		return next({message: "No catalogName supplied"});
	if (!req.query.valueColumn)
		return next({message: "No valueColumn supplied"});
	if (!req.query.textColumn)
		return next({message: "No textColumn supplied"});

	req.query.gui = (req.query.gui || panax_config.enabled_guis[0]).toLowerCase(); // Default GUI
	if (panax_config.enabled_guis.indexOf(req.query.gui) === -1)
		return next({ message: "Unsupported GUI '" + req.query.gui + "'." +
				"Available: " + panax_config.enabled_guis.toString().split(',').join(', ') });

	req.query.output = (req.query.output || 'json').toLowerCase(); // JSON is default output
	if (req.query.output != 'json')
		return next({message: "Unsupported output '" + req.query.output + "'."});

	/**
	 * PanaxJS
	 */
	var panaxdb = new PanaxJS.Connection(panax_config.instances[panax_config.default_instance], req.session); // get userId

	panaxdb.options(req.query, function (err, xml) {
		if(err)
			return next(err);

    if(req.query.gui === 'ng') {
      /*
      Use JS Transformers for AngularJS
       */
        var JSTransformer = require('../transformers/' + req.query.gui + '/options.js');
        JSTransformer.Transform(xml, function(err, result) {
          if (err) 
            return next(err);

          if(req.query.array) {
            res.json(result);
          } else {
            res.json({
              success: true,
              action: "options",
              gui: req.query.gui,
              data: result
            });
          }
        });
    } else {
      /*
      Use XSLT for anything else
       */
  		libxslt.parseFile('xsl/' + req.query.gui + '/catalogOptions.xsl', function (err, stylesheet) {
  			if (err)
  				return next(err);

  			stylesheet.apply(xml, function (err, result) {
  				if (err)
  					return next(err);
  				
  				try {
  					if(req.query.array) {
  						res.json(JSON.parse(util.sanitizeJSONString(result)));
  					} else {
  						res.json({
  							success: true,
  							action: "options",
  							gui: req.query.gui,
  							data: JSON.parse(util.sanitizeJSONString(result))
  						});
  					}
  				} catch (e) {
  					return next({
  						message: '[Server Exception] ' + e.name + ': ' + e.message,
  						stack: e.stack,
  						result: result.replace(/[\\n?\\t]/g, '')
  					});
  				}
  			});
  		});
    }
	});
});