/*
  https://github.com/nodejitsu/node-http-proxy
  https://github.com/jshttp/basic-auth
  https://github.com/philippotto/transformer-proxy
*/

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
  //  //{'name' : 'Access-Control-Allow-Origin', 'value' : 'https://staging.jando.com'}
  // ];
 //  var transformerOptions = {
 //   //headers: headers
 //   //match : /\.js([^\w]|$)/
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

var server1_handler = function (req, res) {
  var need_authentication = function(){
    //console.log('From IP: ' + req.headers['cf-connecting-ip']);
    if(req.headers.host == 'ivrapi.jando.com'){
      return false;
    }
    var checks = ['/consumer-api/'];
    for (var i = 0; i < checks.length; i++){
      var c = checks[i];
      if(req.url.length >= c.length){
        //console.log(c + ' == ' + req.url.substr(0,c.length));
        if(req.url.length >= c.length && req.url.substr(0,c.length) == c){
          return false;
          continue;
        }
      }
    }
    //whitelist Spika office
    if(req.headers['cf-connecting-ip'] == '151.237.234.82'){
      return false;
    };
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

  var need_auth = need_authentication();
  if(need_auth){
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="staging.jando.com"')
    res.end('Please contact Jando for access credentials.')
    return;
  }

  var req_obj = {};
  req_obj.headers = req.headers;
  req_obj.url = req.url;
  console.log('------------------------------------------');

  console.log('cf-ipcountry' + ' ' + req_obj.headers['cf-ipcountry']);
  console.log('x-forwarded-for' + ' ' + req_obj.headers['x-forwarded-for']);
  console.log('host' + ' ' + req_obj.headers.host);
  console.log('url' + ' ' + req_obj.url);

  //staging.jando.com servers
  var cms_server = '52.50.7.180:80';
  var demo_server = '52.50.7.180:80';
  var spika_server = '54.154.134.41:8080';
  var api1 = '52.50.7.180:31001';
  var wordpress = '54.194.242.105:80'
  var target = '';

  if(target.length == 0 && req_obj.headers.host == 'ivrapi.jando.com'){
    target = 'http://52.50.7.180:31005';
    req.url = '/ivrapi' + req.url;  //currenly inside xml-api
  }

  if(target.length == 0 && req_obj.headers.host == 'cms-test.jando.com'){
    target = 'http://' + wordpress;
  }

  if(target.length == 0 && req_obj.headers.host == 'admin-stage.jando.com'){
    target = 'http://' + demo_server;
  }
  if(target.length == 0 && req_obj.headers.host == 'consumer-stage.jando.com'){
    target = 'http://' + demo_server;
  }

  //from here is defaults to staging.jando.com

  if(target.length == 0 && req.url === '/'){
    target = 'http://' + cms_server;
  }

  if(target.length == 0){
    var checks = ['/consumer-api/'];
    for (var i = 0; i < checks.length; i++){
      var c = checks[i];
      if(req.url.length >= c.length){
        //console.log(c + ' == ' + req.url.substr(0,c.length));
        if(req.url.length >= c.length && req.url.substr(0,c.length) == c){
          target = 'http://' + api1;
          req.url = req.url.replace('/consumer-api','');
          continue;
        }
      }
    }
  }

  if(target.length == 0){
    var checks = ['/index','/arabic','/jcss/','/jfonts/','/jimg/','/jjimg/','/jjs/','/jlib/','/src/','/tandc'];
    for (var i = 0; i < checks.length; i++){
      var c = checks[i];
      if(req.url.length >= c.length){
        //console.log(c + ' == ' + req.url.substr(0,c.length));
        if(req.url.length >= c.length && req.url.substr(0,c.length) == c){
          target = 'http://' + cms_server;
          continue;
        }
      }
    }
  }

  if(target.length == 0){
    target = 'http://' + spika_server;
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

