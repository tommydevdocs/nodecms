var express = require('express');
var path = require('path');
var moment = require('moment');
var sql = require('./services/sql-service.js');

//This line needs commented out because serve-favicon crashes the app.
//var favicon = require('serve-favicon');
var logger = require('morgan');
var xFrameOptions = require('x-frame-options');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var history = require('./routes/cms/history');

var routes = require('./routes/index');
var users = require('./routes/cms/users');
var dashboard = require('./routes/cms');
var posts = require('./routes/cms/posts');
var blog = require('./routes/blog');
var app = express();

var middleware = xFrameOptions("ALLOW-FROM *");
var genuuid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};
app.use(xFrameOptions());
app.use(session({
  genid: function(req){
    return genuuid();
  },
  cookieName: 'sess',
  secret: 'DAVIDLARIVIERE',
  duration: 520 * 60 * 1000,
  activeDuration: 520 * 60 * 1000,
  resave: true,
  saveUninitialized: true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
//Change these to /node_modules/bootstrap/dist
app.use("/public/stylesheets",express.static(__dirname + "/stylesheets"));
app.use("/public/javascripts",express.static(__dirname + "/javascripts"));
app.use("/bower_components",express.static(__dirname + "/bower_components"));
app.use('/', routes);
app.use('/cms/users', users);
app.use('/cms/history', history);
app.use('/cms/', dashboard);
//remove this route.
app.use('/blog', blog);
app.use('/cms/posts', posts);


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
  		res.get('X-Frame-Options');
    console.log("USER: " + JSON.stringify(req.sess));
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
    var historyInfo = {
               a: "Error",
               uid: req.sess.user,
               uname: req.sess.userName,
               details: err
           };
            sql.addHistory(historyInfo, function(results){
       });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
		res.get('X-Frame-Options');
    console.log("USER: " + JSON.stringify(req.sess));
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
  var historyInfo = {
               a: "Error",
               uid: req.sess.user,
               uname: req.sess.userName,
               details: err
           };
            sql.addHistory(historyInfo, function(results){
       });
});

module.exports = app;
