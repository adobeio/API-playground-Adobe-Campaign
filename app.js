var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('webhook-server:server');
var request = require('request');
var fs = require('fs');
var jwt = require('jwt-simple');

var app = express();
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = require('http').Server(app);
var io = require('socket.io')(server);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
    next();
});

// Static iles
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});

module.exports = app;

//Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; // named pipe
  }

  if (port >= 0) {
    return port; // port number
  }

  return false;
}

// Event listener for HTTP server "error" event
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

var campaignClientID, campaignClientSecret, campaignJWTToken, campaignAccessToken, campaignTenant, campaignEndpoint;

io.on('connection', function (socket) {
  socket.emit('welcome', {});

  socket.on('getCampaignAccessToken', function (campaignCredentials) {

    campaignClientID = campaignCredentials.clientID;
    campaignClientSecret = campaignCredentials.clientSecret;
    campaignJWTToken = campaignCredentials.jwtToken;
    campaignTenant = campaignCredentials.tenant;
    campaignEndpoint = 'https://mc.adobe.io/' + campaignTenant + '/campaign';

    //console.log("campaignClientID: " + campaignClientID);
    //console.log("campaignClientSecret: " + campaignClientSecret);
    //console.log("campaignJWTToken: " + campaignJWTToken);
    //console.log("campaignTenant: " + campaignTenant);
    //console.log("campaignEndpoint: " + campaignEndpoint);

    // get campaign access tokens
    var campaignAccessTokenOptions = {
      method: 'POST',
      url: 'https://ims-na1.adobelogin.com/ims/exchange/jwt/',
      headers: {
        'content-type': 'multipart/form-data',
        'cache-control': 'no-cache'
      },
      formData: {
        client_id: campaignClientID,
        client_secret: campaignClientSecret,
        jwt_token: campaignJWTToken
      }
    };

    request(campaignAccessTokenOptions, function (error, response, body) {
      if (error) throw new Error(error);

      if (JSON.parse(body).access_token) {
        campaignAccessToken = "Bearer " + JSON.parse(body).access_token;
        console.log("campaignAccessToken:" + campaignAccessToken);
        socket.emit('message', {status:'Success', text:"Campaign Access Token generated. Campaign Access Token: " + campaignAccessToken});
        socket.emit('CampaignConnection');
      } else {
        socket.emit('message', {status:'Fail', text:"Campaign Access Token can't be generated, please check your credentials."});
      }
    });
  });

  socket.on('getCampaignCredentials', function () {
    socket.emit('campaignCredentials', {jwtToken: campaignJWTToken, clientSecret: campaignClientSecret, clientID: campaignClientID, accessToken: campaignAccessToken, tenant: campaignTenant, endPoint: campaignEndpoint})
  });


  socket.on('runCampaignQuery', function (queryParam) {

    var campaignQuery = {
      method: queryParam.method,
      url: queryParam.url,
      headers: {
        'cache-control': 'no-cache',
        'x-api-key': campaignClientID,
        authorization: campaignAccessToken,
        'content-type': 'application/json;charset=utf-8'
      }
    };

    request(campaignQuery, function (error, response, body) {
      if (error) throw new Error(error);
      socket.emit('campaignQuerySuccess', {returnCSSSelector:queryParam.returnCSSSelector, error:error, response:response, body:body});
    });

  })

});