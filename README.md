#Installation

First install node.js. Then:

$ npm install proxy-aca
##Overview

##Configure

First, we need to define the configuration. Under the config folder, there is a config.json file.

Edit the file to suit your configuration needs:

  {
	"AcaProxyServerPort" : "9000",
	"key" : "./certificates/key.pem",
    "cert" : "./certificates/cert.pem",
    "viersCert":"viersCert.pem",
    "infoLog" : "./logs/proxy-aca-info.log",
    "errorLog" : "./logs/proxy-aca-error.log",
    "viersHostName" : "localhost",
    "viersPort" : "8088",
    "viersEndPoint" : "/MockACAEnrollmentVerificationHttpBinding"
}


##Running aca proxy

Under the proxy-aca folder, there is a app.js file. Run

$ node app.js