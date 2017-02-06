//router 54.229.111.165

/*
	https://github.com/nodejitsu/node-http-proxy
	https://github.com/donasaur/http-proxy-rules
  https://github.com/jshttp/basic-auth
  https://github.com/philippotto/transformer-proxy
*/

var http = require('http');
var httpProxy = require('http-proxy');
var httpProxyRules = require('http-proxy-rules');
var auth = require('basic-auth');
var path = require('path');
var url = require('url');
var transformerProxy = require('transformer-proxy'); 
var cors = require('cors');

var proxy = new httpProxy.createProxyServer();
var cors = require('cors')




var req_debug_obj = function(req){
    var req_params_obj = {};
    for (k in req.params) {
        req_params_obj[k] = req.params[k];
    };

    var req_obj = {};
    req_obj.params = req_params_obj;
    req_obj.query = req.query;
    req_obj.body = req.body;
    req_obj.headers = req.headers;

    req_obj.other = {};
    req_obj.other.httpVersion = req.httpVersion;
    req_obj.other.method = req.method;
    req_obj.other.rawHeaders = req.rawHeaders;
    req_obj.other.rawTrailers = req.rawTrailers;
    req_obj.other.statusMessage = req.statusMessage;
    req_obj.other.trailers = req.trailers;
    req_obj.other.url = req.url;

    req_obj.other.app = req.app;
    req_obj.other.baseUrl = req.baseUrl;
    req_obj.other.cookies = req.cookies;
    req_obj.other.fresh = req.fresh;
    req_obj.other.hostname = req.hostname;
    req_obj.other.ip = req.ip;
    req_obj.other.ips = req.ips;
    req_obj.other.originalUrl = req.originalUrl;
    req_obj.other.path = req.path;
    req_obj.other.protocol = req.protocol;
    req_obj.other.route = req.route;
    //req_obj.other.secure = req.secure;
    req_obj.other.signedCookies = req.signedCookies;
    req_obj.other.subdomains = req.subdomains;
    req_obj.other.xhr = req.xhr;	

    //req_obj.connection = req.connection;

    return req_obj;
}



/*
https://staging.jando.com/register/new-products-debug-info


*/



proxy.on('proxyReq', function(proxyReq, req, res, options) {
  if(req.headers['host'] && req.headers['host'] == 'staging1.jando.com'){
  	proxyReq.setHeader('Host', 'staging.jando.com');
  }
  //proxyReq.setHeader('Referer', 'http://staging.jando.com/');

  // if(req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] == 'https'){
  // 	console.log('Setting X-Forwarded-Proto');
  // 	proxyReq.setHeader('X-Forwarded-Proto', 'http');
  // }
  console.log('RAW Request from the client', JSON.stringify(req.headers, true, 2));
});

proxy.on('error', function (err, req, res) {
	console.error(err);
  res.writeHead(500, {'Content-Type': 'text/plain'});
  res.end('Proxy error 2');
});




proxy.on('proxyRes', function(proxyRes, req, res) {
  console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
  //res.setHeader('Access-Control-Allow-Origin', 'https://staging.jando.com');
  //res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');


	var transformerFunction2 = function (data, req, res) {
	  //return data + "\n // an additional line at the end of every file";
	  var new_data1 = data + "\n";
	  //var new_data2 = new_data1.split('s3-eu-west-1.amazonaws.com/qa.jando-frontend').join('staging.jando.com');
	  //var new_data2 = new_data1.split('filer-icons/jquery-filer.css').join('filter-icons/jquery-filter.css');
	  //var new_data2 = new_data1.replace('s3-eu-west-1.amazonaws.com/qa.jando-frontend','staging.jando.com');
	  return new_data2;
	};
	var transformerFunction = function (data, req, res) {
	  return data;
	};

	var headers = [
		//{'name' : 'Access-Control-Allow-Origin', 'value' : 'https://staging.jando.com'} 
	];
  var transformerOptions = {
  	//headers: headers
  	//match : /\.js([^\w]|$)/
  };
  var next = function(err,req,res){

  };

  //transformerProxy(transformerFunction, transformerOptions)(req,res,next);


	var corsOptions = {
	  origin: 'https://staging.jando.com',
	  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
	};
  cors()(req,res,next);

});

proxy.on('open', function (proxySocket) {
  // listen for messages coming FROM the target here
  //proxySocket.on('data', hybiParseAndLogMessage);
});

proxy.on('close', function (res, socket, head) {
  // view disconnected websocket connections
  console.log('Client disconnected');
});

// var proxy_options = {
//   target: 'http://localhost:9002'
// };




// var proxyRules = new httpProxyRules({
//   rules: {
//     '.*/test': 'http://localhost:8080/cool', // Rule (1)
//     '.*/test2/': 'http://localhost:8080/cool2/' // Rule (2)
//   },
//   default: 'http://localhost:8080' // default target
// });


var proxyRules = new httpProxyRules({
  rules: {
    '.*/': 'http://52.50.7.180:80/', // Rule (1)
//    '.*/arabic': '52.50.7.180:80/arabic/' // Rule (2)
    '.*/index.html': 'http://52.50.7.180:80/index.html', // Rule (2)
    '.*/arabic.html': 'http://52.50.7.180:80/arabic.html' // Rule (2)
  },
  default: 'http://54.154.134.41:8080/' // default target
});



var server1_handler = function (req, res) {
//allow 151.237.234.82/32;
//http://54.154.134.41:8080/
//http://52.50.7.180:80

  var need_authentication = function(){
	  console.log('From IP: ' + req.headers['cf-connecting-ip']);
  	if(req.headers['cf-connecting-ip'] == '151.237.234.82'){
	    return false;
	  };
  	var credentials = auth(req);
  	if (!credentials){
	    return true;
	  }
	  console.log('Auth: ' + credentials.name + ':' + credentials.pass);
  	if (credentials.name == 'admin' || credentials.pass == 'J@nd0123'){
	    return false;
	  }
  	if (credentials.name == 'jaco' || credentials.pass == 'SecretPassword1'){
	    return false;
	  }
	  return true;
  }

  var need_auth = need_authentication();
  if(need_auth){
	    res.statusCode = 401;
	    res.setHeader('WWW-Authenticate', 'Basic realm="staging.jando.com"')
	    res.end('Please contact Jando for access credentials.')
	    return;
  }

  //console.log(JSON.stringify(req_debug_obj(req),null,2));


    // "host": "staging.jando.com",
    // "cf-ipcountry": "ZA",
    // "x-forwarded-for": "105.5.197.22",
    // "cf-ray": "2f9e8bf7ffc615ec-JNB",
    // "referer": "https://staging.jando.com/",
    // "accept-language": "en-US,en;q=0.8",
    // "cookie": "__cfduid=dcb6e55425534dc33836dc7832cbe6cda1472784702; JSESSIONID=8A01B6755AC58A5B21F1B94EBC03A848",
    // "cf-connecting-ip": "105.5.197.22"

  // res.setHeader('Access-Control-Allow-Origin', 'https://staging.jando.com');
  // res.setHeader('Access-Control-Allow-Origin', 'https://s3-eu-west-1.amazonaws.com');

  var req_obj = {};
  req_obj.headers = req.headers;
  req_obj.url = req.url;
  //req_obj.url_parts = url.parse(req.url);
  console.log('------------------------------------------');
  //console.log(JSON.stringify(req_obj,null,2));
  //console.log(JSON.stringify(req_obj,null,2));

  console.log('cf-ipcountry' + ' ' + req_obj.headers['cf-ipcountry']);
  console.log('x-forwarded-for' + ' ' + req_obj.headers['x-forwarded-for']);
  //console.log('cf-connecting-ip' + ' ' + req_obj.headers['cf-connecting-ip']);
  console.log('host' + ' ' + req_obj.headers.host);
  console.log('url' + ' ' + req_obj.url);



        // proxy_set_header Host $host:$server_port;
        // proxy_set_header X-Real-IP $remote_addr;
        // proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        // proxy_set_header X-NginX-Proxy true;


  var cms_server = '52.50.7.180:80';
  var spika_server = '54.154.134.41:8080';
  var target = 'http://' + spika_server; // + req.url; //default
  if(req.url === '/'){
    target = 'http://' + cms_server;
  } else {
	  var checks = ['/index','/arabic','/jcss/','/jfonts/','/jimg/','/jjimg/','/jjs/','/jlib/','/src/','/tandc'];  //,'/css/','/js/'
	  for (var i = 0; i < checks.length; i++){
	  	var c = checks[i];
	  	if(req.url.length >= c.length){
	  		//console.log(c + ' == ' + req.url.substr(0,c.length));
		  	if(req.url.length >= c.length && req.url.substr(0,c.length) == c){
		  		target = 'http://' + cms_server; // + req.url;
		  		continue;
		  	}
	  	}
	  }
  }


  console.log('target: ' + target);
  var proxy_options = {
  	//toProxy: true,
  	xfwd: true,
	  target: target
	};

  // var target = proxyRules.match(req);
  // if (target) {
  // 	proxy_options.target = target;
  // };
  proxy.web(req, res, proxy_options);

  // res.writeHead(500, { 'Content-Type': 'text/plain' });
  // res.end('Proxy error 3');
}


//unsure about this example
// var server1_handler = function (req, res) {
// 	var proxy_error_handler = function (err) {
// 	  if(err){
// 		  res.writeHead(502);
// 		  res.end("Proxy error 1");
// 	  }
// 	}
//   proxy.web(req, res, proxy_options, proxy_error_handler);
// }



var server1 = http.createServer(server1_handler);
server1.listen(80);

// var server2 = http.createServer(function (req, res) {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
//   res.end();
// });
// server2.listen(9002);




 // (?:\\W|$) is appended to the end of the regex-supported url path, 
  // so that if there is a key like .*/test in the rules, 
  // the module matches paths /test, /test/, /test? but not /testing.


/*

also see:
http://albertolarripa.com/2013/11/10/node-as-proxy-proxying-http-and-websockets/

function asyncAuth(req, res, next) {
    var done = false;
    whitelist.forEach(function(regexp) {
        if (req.url.match(regexp)) {
            done = true;
            next();
        }
    });
    if (!done) requireAuth(next);
}
app.use(function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip);
    next();
});


Alternative edit response: https://github.com/nodejitsu/node-http-proxy/issues/382#issuecomment-238874229



var options = {
  hostnameOnly: true,
  maxSockets: 500,
  router: {
    'albertolarripa.com': '127.0.0.1:8080',
    'albertosysadmin.com': '127.0.0.1:8181',
    'test.albertolarripa.com': '127.0.0.1:8282'
  }
}
var proxyServer = httpProxy.createServer(options).listen(80);


var options = {
  maxSockets: 500,
  router: {
    'albertolarripa.com/doc': '127.0.0.1:8080',
    'albertosysadmin.com/info': '127.0.0.1:8181',
    'test.albertolarripa.com/author': '127.0.0.1:8282'
  }
}

var options = {
  pathnameOnly: true,
  maxSockets: 500,
  router: {
    '/doc': '127.0.0.1:8080',
    '/info': '127.0.0.1:8181',
    '/author': '127.0.0.1:8282'
  }
}




*/


