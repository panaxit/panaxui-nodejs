var express = require('express');
var router = express.Router();
var libxslt = require('libxslt');
var PanaxJS = require('panaxjs');
var config = require('../config/panax.js');

var fs = require('fs');
var pate = require('node-pate');
var formatter = require('../lib/format');
var util = require('../lib/util.js');
var auth = require('../lib/auth.js');

module.exports = router;

/**
 * GET /api/read
 *
 * Read Entity DATA
 */
router.get('/', auth.requiredAuth, function read(req, res, next) {
	if (!req.query.catalogName)
		return next({message: "No catalogName supplied"});

	req.query.gui = (req.query.gui || config.ui.enabled_guis[0]).toLowerCase(); // Default GUI
	if (config.ui.enabled_guis.indexOf(req.query.gui) === -1)
		return next({ message: "Unsupported GUI '" + req.query.gui + "'." +
				"Available: " + config.ui.enabled_guis.toString().split(',').join(', ') });

	req.query.output = (req.query.output || 'json').toLowerCase(); // JSON is default output
	if (req.query.output != 'json' && req.query.output != 'html')
		return next({message: "Unsupported output '" + req.query.output + "'."});

	/**
	 * PanaxJS
	 */
	var panaxdb = new PanaxJS.Connection(config, req.query);

	panaxdb.setParam('userId', req.session.userId);
	panaxdb.setParam('tableName', req.query.catalogName);
	panaxdb.setParam('getData', (req.query.getData || '1'));
	panaxdb.setParam('getStructure', (req.query.getStructure || '0'));
	panaxdb.setParam('lang', (req.session.lang || 'DEFAULT'));

	panaxdb.read(function (err, xml) {
		if(err)
			return next(err);

		PanaxJS.Util.parseCatalog(xml, function (err, catalog) {
			if(err)
				return next(err);

			if (catalog.controlType === 'fileTemplate') {

				if(!catalog.fileTemplate)
					return next({message: "Missing fileTemplate"});

				try {
					pate.parse({
						tpl: fs.readFileSync('templates/' + req.query.catalogName + '/' + catalog.fileTemplate),
						xml: xml,
						xpath: '/*/px:data/px:dataRow',
						ns: {
							px: 'urn:panax'
						},
						format_lib: formatter
					}, function (err, result) {
						// ToDo: Should handle content-type according to template file (ex. SVG)
						res.set('Content-Type', 'text/html');
						res.send(result);
					});
				} catch (e) {
					return next({
						message: '[Server Exception] ' + e.name + ': ' + e.message,
						stack: e.stack
					});
				}
			} else {
				libxslt.parseFile('xsl/' + req.query.gui + '/' + req.query.output + '.xsl', function (err, stylesheet) {
					if (err)
						return next(err);

					stylesheet.apply(xml, function (err, result) {
						if (err) 
							return next(err);

						if (req.query.output == 'json') {
							try {
								res.json({
									success: true,
									action: "read",
									gui: req.query.gui,
									output: req.query.output,
									data: JSON.parse(util.sanitizeJSONString(result))
								});
							} catch (e) {
								return next({
									message: '[Server Exception] ' + e.name + ': ' + e.message,
									stack: e.stack,
									result: result.replace(/\n/g, '').replace(/\t/g, '')
								});
							}
						} else if (req.query.output == 'html') {
							res.set('Content-Type', 'text/html');
							res.send(result);
						}
					});
				});
			}
		});
	});
});