var express = require('express');
var router = express.Router();
var PanaxJS = require('../../PanaxJS/index');
var panax_config = require('../config/panax');

var fs = require('fs');
var libxslt = require('libxslt');
var pate = require('node-pate');

var util = require('../lib/util.js');
var formatter = require('../lib/format');

module.exports = router;

/**
 * GET /api/read
 *
 * Read Entity DATA
 */
router.get('/', function read(req, res, next) {
	if (!req.session.userId)
		return next({message: "Error: Not logged in"});
	if (!req.query.catalogName)
		return next({message: "Error: No catalogName supplied"});

	req.query.output = (req.query.output || 'json').toLowerCase(); // JSON is default output

	if (req.query.output != 'json' && req.query.output != 'html')
		return next({message: "Error: Output '" + req.query.output + "' not supported"});

	var oPanaxJS = new PanaxJS(req.query);

	oPanaxJS.set('userId', req.session.userId);
	oPanaxJS.set('tableName', req.query.catalogName);
	/**/oPanaxJS.set('output', req.query.output);
	oPanaxJS.set('getData', (req.query.getData || '1'));
	oPanaxJS.set('getStructure', (req.query.getStructure || '0'));
	oPanaxJS.set('lang', (req.session.lang || 'DEFAULT'));

	oPanaxJS.getXML(panax_config.db.config, function (err, xml) {
		var xmlDoc = libxslt.libxmljs.parseXml(xml);

		if(!xmlDoc)
			return next({message: "Error: Parsing XML"});

		if (xmlDoc.root().attr("controlType").value() == 'fileTemplate') {

			var fileTemplate = xmlDoc.root().attr("fileTemplate");

			if(!fileTemplate)
				return next({message: "Error: Missing fileTemplate"});

			try {
				pate.parse({
					tpl: fs.readFileSync('templates/' + req.query.catalogName + '/' + fileTemplate.value()),
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
			libxslt.parseFile('xsl/' + req.query.output + '.xsl', function (err, stylesheet) {
				if (err)
					return next(err);

				stylesheet.apply(xml, function (err, result) {
					if (err) 
						return next(err);

					if (req.query.output == 'json') {
						res.json(JSON.parse(util.sanitizeJSONString(result)));
					} else if (req.query.output == 'html') {
						res.set('Content-Type', 'text/html');
						res.send(result);
					}
				});
			});
		}
	});
});