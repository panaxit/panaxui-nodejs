/*
Required modules
 */
var fs = require('fs'),
	Saxon = require('saxon-stream');

/*
 
 */
var saxon = new Saxon('../vendor/SaxonHE9-6-0-3J/saxon9he.jar');
var xml = fs.createReadStream('test.xml', {encoding: 'utf-8'});
var xslt = saxon.xslt('test.xsl');

xslt.on('error', function(err) {
	console.log('ERROR XSLT:')
	console.dir(err);
});

var transform = xml.pipe(xslt);

// Not working?
transform.on('error', function(err) {
	console.log('ERROR TRANSFORM:')
	console.dir(err);
});

transform.on('data', function(data) {
	console.log('DATA TRANSFORM:')
	console.log(data.toString());
});

transform.on('end', function() {
	console.log('END TRANSFORM:')
});



/*
var jarPath = __dirname+'/vendor/SaxonHE9-6-0-3J/saxon9he.jar';
var xmlPath = __dirname+'/test.xml';
var xslPath = __dirname+'/test.xsl';

var outputPath = __dirname+'/test_out.xml';
var xslt = saxon(jarPath,xslPath,{timeout:5000});
xslt.on('error',function(err){
  console.log(err);
});

fs.createReadStream(xmlPath,{encoding:'utf-8'}).pipe(
  xslt
).pipe(fs.createWriteStream(outputPath));

// or
fs.createReadStream(xmlPath,{encoding:'utf-8'}).pipe(
  xslt
).on('data',function(cont){
  console.log(cont);
});
*/