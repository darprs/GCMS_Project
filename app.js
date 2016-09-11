var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
global.mongoose = require('mongoose');
var models = require('./mongoose_models.js');
var Schema = mongoose.Schema;
var xmlreader = require('xmlreader');
require('console-stamp')(console, '[HH:MM:ss.l]');
global.farms = ["http://localhost:8080/farm/","http://localhost:8090/farm/"];

var routes = require('./routes/index');
var farm = require('./routes/farm.js');

var app = express();

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


//add global config object
global.app_config = {};

//read config xml to app_config object
function read_configuration_file_to_appconfig (config_path, callback){
    console.log("Trying to read configuration from " + config_path);
    fs.readFile( config_path, function (err, file) {
        if (err) {
            throw err;
        }
        else {
            xmlreader.read(file.toString(), function (err, res) {
                if (err) return console.log(err);
                else {
                    app_config.db_server = res.AppConfiguration.DB_server.text();
                    app_config.db_port = res.AppConfiguration.DB_server_port.text();
                    app_config.db_name = res.AppConfiguration.DB_name.text();
                    app_config.geoPrefix = res.AppConfiguration.GeoPrefix.text();
                    app_config.startUID = res.AppConfiguration.StartUID.text();
                    console.log("Configuration retreived : " + app_config.db_server + ':' + app_config.db_port + '/' + app_config.db_name);
                    callback();
                }
            });
        }
    });
}


function mongoose_connect() {
    con_str = 'mongodb://' + app_config.db_server + ':' + app_config.db_port + '/' + app_config.db_name;
    mongoose.connect(con_str);
    console.log('Connected via Mongoose to :' , con_str);
}

read_configuration_file_to_appconfig(__dirname + '/appconfig.xml',mongoose_connect);


app.use('/', routes);
app.use('/farm',farm);



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
