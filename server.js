/*
	https://github.com/nodejitsu/node-http-proxy
  https://github.com/jshttp/basic-auth
  https://github.com/philippotto/transformer-proxy

  54.229.111.165
*/

//TODO move config out to file that can be hot loaded

var auth_whitelist_ip = ['151.237.234.82','91.184.200.174','196.213.190.250','196.210.37.3'];
// Spika, Cyprus, Stellenbosh

var auth_whitelist_host = [
  'ivrapi.jando.com',
  'consumer-web-api-test.jando.com',
  'consumer-api-test',
  'web-assets-test.jando.com',
  'admin-web-api-test.jando.com',
  'business-web-api-test.jando.com',
  'api.jando.com',
  'gps-ehi.jando.com',
  'gps-ehi-test.jando.com',
  'xml-api.jando.com'
];

var auth_users = [
  {name: 'Jaco', pass: 'BWop123'},
  {name: 'Matti', pass: 'KPW345ds'},
  {name: 'Tim', pass: 'g84LcSrL'},
  {name: 'Hratch', pass: 'FzVPkwSx'},
  {name: 'Limor', pass: 'Qdckvkn4'},
  {name: 'MJ', pass: '2DvGn5Rv'},
  {name: 'Christine', pass: 'KWnTJBZb'},
  {name: 'Tsholo', pass: 'ccfHmwH8'},
  {name: 'Jamie', pass: 'umDfn6q5'},
  {name: 'Xanthe', pass: 'JpFMwwVk'},
  {name: 'Sean', pass: 'A2bn2zKq'},
  {name: 'Marius', pass: 'TpVREfEF'},
  {name: 'Marios', pass: 'YjedUYhF'},
  {name: 'Gabriel', pass: 'vQcjeXTS'},
  {name: 'Agazio', pass: 'sJYSEB8C'},
  {name: 'Alex', pass: 'ks8PZudn'},
  {name: 'Pawel', pass: 'NRZwn2p3'},
  {name: 'Kevin', pass: 'NRZwnS23'},
  {name: 'Daniel', pass: 'PuTT78d'},
  {name: 'Yann', pass: 'JUttsd45'},
  {name: 'William', pass: 'NH775tH'}
];

var app_server_gps = '10.0.5.10';
var app_server = '10.0.6.37';
var spika_server = '10.0.6.242';
var wordpress_server = '10.0.4.122';
var accounting_server = '52.48.200.57';

var host_map = [
  {host:'production.jando.com', server: wordpress_server, port: '80'},

  {host:'secure.jando.com', server: spika_server, port: '8080'},
  {host:'admin.jando.com', server: app_server, port: '80'},
  {host:'adminold.jando.com', server: app_server, port: '80'},
  {host:'business.jando.com', server: app_server, port: '80'},
  {host:'consumer.jando.com', server: app_server, port: '80'},

  {host:'web-assets.jando.com', server: app_server, port: '80'},
  
  {host:'gps-ehi.jando.com', server: app_server_gps, port: '31005'},
  {host:'gps-ehi-test.jando.com', server: app_server_gps, port: '31005'},
  {host:'xml-api.jando.com', server: app_server, port: '31005'},
  {host:'ivrapi.jando.com', server: app_server, port: '31005'},
  {host:'consumer-web-api.jando.com', server: app_server, port: '31001'},
  {host:'consumer-api.jando.com', server: app_server, port: '31001'},
  {host:'admin-web-api.jando.com', server: app_server, port: '31002'},
  {host:'business-web-api.jando.com', server: app_server, port: '31006'},
  {host:'api.jando.com', server: app_server, port: '31003'},

  {host:'production.jando.com', server: wordpress_server, port: '80'},

  {host:'accounting.jando.com', server: accounting_server, port: '80'}
];


var http = require('http');
var httpProxy = require('http-proxy');
var auth = require('basic-auth');
var path = require('path');
var url = require('url');
var transformerProxy = require('transformer-proxy'); 
var cors = require('cors');

var proxy = new httpProxy.createProxyServer();

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  //console.log('RAW Request from the client', JSON.stringify(req.headers, true, 2));
});

proxy.on('error', function (err, req, res) {
	console.error(err);
  res.writeHead(500, {'Content-Type': 'text/plain'});
  res.end('Proxy on error');
});

proxy.on('proxyRes', function(proxyRes, req, res) {
  //console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));

	// var transformerFunction = function (data, req, res) {
	//   var new_data1 = data + "\n";
	//   var new_data2 = new_data1.split('s3-eu-west-1.amazonaws.com/qa.jando-frontend').join('staging.jando.com');
	//   return new_data2;
	// };
	// var headers = [
	// 	//{'name' : 'Access-Control-Allow-Origin', 'value' : 'https://staging.jando.com'} 
	// ];
 //  var transformerOptions = {
 //  	//headers: headers
 //  	//match : /\.js([^\w]|$)/
 //  };
 //  var next = function(err,req,res){
 //  };
 //  transformerProxy(transformerFunction, transformerOptions)(req,res,next);

	// var corsOptions = {
	//   origin: 'https://staging.jando.com',
	//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
	// };
 //  cors()(req,res,next);
});

proxy.on('open', function (proxySocket) {
  // listen for messages coming FROM the target here
  //proxySocket.on('data', hybiParseAndLogMessage);
});

proxy.on('close', function (res, socket, head) {
  // view disconnected websocket connections
  //console.log('Client disconnected');
});

function startsWith(s,m){
  if(s.length == 0 || m.length == 0){
    return false;
  }
  if(m.length > s.length){
    return false;
  }
  if(s.substr(0,m.length) == m){
    return true;
  }
  return false;
}

var server1_handler = function (req, res) {
  var need_authentication = function(){
	  //console.log('From IP: ' + req.headers['cf-connecting-ip']);

    //return false;

    for(var i = 0; i < auth_whitelist_ip.length; i++){
      if(req.headers['cf-connecting-ip'] == auth_whitelist_ip[i]){
        return false;
      };
    }
    for(var i = 0; i < auth_whitelist_host.length; i++){
      if(req.headers.host == auth_whitelist_host[i]){
        return false;
      };
    }

    if(startsWith(req.url, '/consumer-api/')){
      return false;
    }

  	var credentials = auth(req);
  	if (!credentials){
	    return true;
	  }

	  //console.log('Auth: ' + credentials.name + ':' + credentials.pass);
    for (var i = 0; i < auth_users.length; i++){
      if(credentials.name == auth_users[i].name && credentials.pass == auth_users[i].pass){
        console.log('auth success: ' + credentials.name);
        return false;
      }
    }

    console.log('auth fail: ' + credentials.name);
	  return true;
  }



  console.log('------------------------------------------');
  var need_auth = need_authentication();
  if(need_auth){
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="staging.jando.com"')
    res.end('Please contact Jando for access credentials.')
    return;
  }

  // var req_obj = {};
  // req_obj.headers = req.headers;
  // req_obj.url = req.url;


  console.log('cf-ipcountry' + ' ' + req.headers['cf-ipcountry']);
  console.log('x-forwarded-for' + ' ' + req.headers['x-forwarded-for']);
  console.log('host' + ' ' + req.headers.host);
  console.log('url' + ' ' + req.url);



  var target = '';

  if(startsWith(req.url,'/consumer-api/')){
    target = 'http://' + app_server + ':' + '31001';
    req.url = req.url.replace('/consumer-api','');
  }

  if(target.length == 0){
    for(var i = 0; i < host_map.length; i++){
      if(req.headers.host == host_map[i].host){
        target = 'http://' + host_map[i].server + ':' + host_map[i].port;
      };
    }
  }

  //no host matches was found
  if(target.length == 0){
    target = 'http://' + wordpress_server + ':' + '80';
  }

  //modify url
  if(req.headers.host == 'ivrapi.jando.com'){
    req.url = '/ivrapi' + req.url;  //currenly inside xml-api
  }




  console.log('target: ' + target);
  var proxy_options = {
  	//toProxy: true,
  	xfwd: true,
	  target: target
	};

  proxy.web(req, res, proxy_options);
}


var server1 = http.createServer(server1_handler);
server1.listen(80);

