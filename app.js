
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var     https = require('https');
var  nconf=    require('nconf');
var    fs = require('fs');
var winston = require('winston');
var S=require('string');
var app = express();
var uuid = require('node-uuid');


var DOMParser = require('xmldom').DOMParser;
var respXML=' ';
var respHeaders='';
var req;
var errorXml='';
var id='';

nconf.file({ file: 'config.json' });



var logger = new (winston.Logger)({
    transports: [

        new (winston.transports.File)({name:'info_logger',filename: nconf.get('infoLog'),level:'info',json: true }),
        new (winston.transports.File)({name:'error_logger',filename: nconf.get('errorLog'),level:'error',json: true })
    ]
});



var options = {
    key: fs.readFileSync(nconf.get('key')),
    cert: fs.readFileSync(nconf.get('cert'))
};
//var httpsServer = https.createServer(options, app);
var httpServer = http.createServer( app);

httpServer.listen(nconf.get("AcaProxyServerPort"));
//app.listen(9000);



function rawBody(req, res, next) {
    req.setEncoding('utf8');
    req.body = '';
    req.on('data', function(chunk) {
        req.body += chunk;
    });
    req.on('end', function(){
        next();
    });
}
app.use(rawBody);
app.use(app.router);

app.post('/', function(request, response) {


    var optionsHTTPSClient = {
        hostname: nconf.get('viersHostName'),
        port: nconf.get('viersPort'),
        path: nconf.get('viersEndPoint'),
        method: 'POST'
        //  cert: fs.readFileSync('viers.cer'),
        //  agent: false
    };


    fs.readFile('errorMsg.xml', function(err, data){
            errorXml=data.toString();
            var doc=new DOMParser().parseFromString(data.toString());
            var n=doc.getElementsByTagName('ns1:IdentificationID')[0];
            id=n.childNodes[0].nodeValue;
        }
    );


    req = http.request(optionsHTTPSClient, function(res) {

        res.on('data', function (chunk) {
            respXML=respXML+chunk;
        });
        res.on('end', function () {
          //  console.log('respXML: '+respXML);
            logger.info('got response ...'+uid.toString()+' : '+respXML);
            response.send(respXML);
            response.end();

        });
    });

    var subStr=  JSON.stringify(request.body).substr(1,JSON.stringify(request.body).length-2);
    var after= S(subStr).replaceAll('\\"', '"').toString()  ;
    var finalRequest=  S(after).replaceAll('\\n', '').toString()  ;

    var uid=uuid.v1();
    logger.info('got request ...'+uid.toString()+' : '+finalRequest);

    req.write(finalRequest);

     //req.addListener();

    req.on('error', function (e) {
        // console.log('-->'+ e.message)
        logger.error('error ...'+uid.toString()+' : '+ e.toString());
        if (e.message.toString().indexOf('ECONNREFUSED') > -1 ){


            //REQUEST DOC
            var requestDoc=new DOMParser().parseFromString(finalRequest.toString());
            var n=requestDoc.getElementsByTagName('ns1:IdentificationID')[0];
            rid=n.childNodes[0].nodeValue;
            var repNode='<ns1:IdentificationID>'+rid+'</ns1:IdentificationID>';

            //error DOC
            var replacedErrXML= errorXml.replace("<ns1:IdentificationID>?</ns1:IdentificationID>",repNode);
            logger.info('got response/error ...'+uid.toString()+' : '+replacedErrXML);

            response.send(replacedErrXML);
        }
    });

    req.end();

});

