var fs = require('fs');
var saxon = require('saxon-transform');

var jarPath = __dirname+'/../vendor/SaxonHE9-6-0-3J/saxon9he.jar';
var xmlPath = __dirname+'/test.xml';
var xslPath = __dirname+'/test.xsl';

var xslt = saxon(jarPath,xslPath,{timeout:5000});
xslt.on('error',function(err){
  console.log(err);
});

// fs.createReadStream(xmlPath,{encoding:'utf-8'}).pipe(
//   xslt
// ).pipe(process.stdout);

// or
fs.createReadStream(xmlPath,{encoding:'utf-8'}).pipe(
  xslt
).on('data',function(cont){
  console.log(cont.toString());
});