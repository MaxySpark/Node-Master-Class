const http          = require('http');
const https         = require('https');
const url           = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config        = require('./config');
const fs            = require('fs');

// Instantiate the HTTP Server
const httpServer = http.createServer(function(req,res){
   unifiedServer(req,res);
});

// Start The HTTP Server
httpServer.listen(config.httpPort,function(){
    console.log("The Server is listening on port "+ config.httpPort);
    console.log("http://localhost:"+config.httpPort);
});

// Instantiate the HTTPS Server

let httpsServerOptions = {
    'key'   : fs.readFileSync('./https/key.pem'),
    'cert'  : fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req,res);
 });
 
 // Start The HTTPS Server
 httpsServer.listen(config.httpsPort,function(){
     console.log("The Server is listening on port "+ config.httpsPort);
     console.log("http://localhost:"+config.httpsPort);
 });

// All the server logic for both the http and https server
let unifiedServer = function(req,res) {
     // get the url and parse it
     let parseUrl = url.parse(req.url, true);

     // get the path from the url
     let path = parseUrl.pathname;
     let trimmedPath = path.replace(/^\/+|\/+$/g,'');
 
     // get the query string as an object
     let queryStringObject = parseUrl.query;
 
     // get the http method
     let method = req.method.toLocaleLowerCase();
 
     // get the headers as an object
     let headers = req.headers;
 
     // get the payloads
     let decoder = new StringDecoder('utf-8');
     let buffer = '';
     req.on('data',function(data) {
         buffer += decoder.write(data);
     });
     req.on('end',function(){
         buffer += decoder.end();
 
         // choose the handler this request should go to. If one is not found, use the not found handler
         let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
 
         // Consruct the data object to send to the handler
         let data = {
             'trimmedPath' : trimmedPath,
             'queryStringObject' : queryStringObject, 
             'method' : method,
             'headers' : headers,
             'payload' : buffer
         };
 
         // Router the request to the handler specified in the router
         chosenHandler(data,function(statuscode,payload){
             // Use the status code called back by the handler, or default to 200
             statuscode = typeof(statuscode) == 'number' ? statuscode : 200;
             // Use the called back by the handler or default to an empty string
             payload = typeof(payload) == 'object' ? payload : {};
 
             // Convert payload to a string
             let payloadString = JSON.stringify(payload);
 
             res.setHeader('content-type','application/json');
 
             // Return response
             res.writeHead(statuscode);
             res.end(payloadString);
             
             // log out the request path
         console.log('Request Recieved With These Response : ',statuscode,payloadString);
 
         });
 
         // res.end("hello world\n");
         // console.log('Request Recieved With These payload : ',buffer);
     });
 
     // // send the response
     // res.end("hello world\n");
     
     // // log the request path
     // // console.log('Request recieved on path: '+trimmedPath + ' with method '+ method + ' with these query string parameters '+ JSON.stringify(queryStringObject));
     // console.log('Request Recieved With These Headers : ',headers);
}

// define handlers
let handlers = {};

// sample handler
handlers.sample = function(data,callback) {
    // Callback a http status code, and a payload object
    callback(406,{'name': 'sample handler'});
};

// Not found handler
handlers.notFound = function(data,callback) {
    callback(404);
};

// define a request router
let router = {
    'sample' : handlers.sample
}