// curl -k https://localhost:8000/
var https = require('https');
var http = require('http');
var fs = require('fs');

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};


var optionsHTTPSClient = {
    hostname: 'localhost',
    port: 8443,
    path: 'MockACAEnrollmentVerificationHttpBinding',
    method: 'POST',
    cert: fs.readFileSync('viers.cer'),
    agent: false
};


http.createServer( function (req, res) {

   console.log('data at 7000: '+ JSON.stringify(req.headers));
    res.writeHead(200);
    res.end("hello world\n");
}).listen(7000);