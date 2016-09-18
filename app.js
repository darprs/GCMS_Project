var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
global.mongoose = require('mongoose');
var models = require('./mongoose_models.js');
var Schema = mongoose.Schema;
require('console-stamp')(console, '[HH:MM:ss.l]');
var fs = require('fs');

var routes = require('./routes/index');
var farm = require('./routes/farm.js');
var api = require('./routes/api.js');





var app = express()  ,
    stylus = require('stylus')
    , nib = require('nib');

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}

app.use(stylus.middleware(
    { src: __dirname + '/public'
        , compile: compile
    }
))


global.app_config = {};


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


app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
//app.use('/js', express.static(__dirname + '/node_modules/jquery.cookie'))
//app.use('/js', express.static(__dirname + '/node_modules/jquery-ui/external/jquery'))
//app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap


function init_app(config_path,callback) {
    console.log("Trying to read configuration from " + config_path);
    fs.readFile(config_path, function (err, file) {
        if (err) {
            throw err;
        }
        else {
            console.log("Using configuratgion from : ", config_path);
            var conf = JSON.parse(file);
            app_config.DB_server = conf["DB_server"];
            app_config.DB_server_port = parseInt(conf["DB_server_port"]);
            app_config.DB_name = conf["DB_name"];
            app_config.GeoPrefix = conf["GeoPrefix"];
            app_config.StartUID = conf["StartUID"];
            app_config.farms = conf["farms"];
            console.log(app_config);
            callback();
        }
    });
};

function mongoose_connect() {
    con_str = 'mongodb://' + app_config.DB_server + ':' + app_config.DB_server_port  + '/' + app_config.DB_name;
    mongoose.connect(con_str);
    console.log('Connected via Mongoose to :' , con_str);
}

init_app(__dirname + '/configuration.json',mongoose_connect);



app.use('/', routes);
app.use('/farm',farm);
app.use('/api',api);


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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
