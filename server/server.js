//Loading Dependencies
var bodyParser     = require('body-parser');
var express        = require('express');
var methodOverride = require('method-override');
var morgan         = require('morgan');

var app = express();

// db config
var db = require('./dbconfig/db');

var config = require('./package').config;

// set our port
var port = config.port;

// parse application/json
app.use(bodyParser.json());

// set up morgan for console logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response-time[digits]'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

app.use('/', express.static(__dirname + './../app'));

// configure our routes
app.use(require('./routes/_routes'));

app.listen(port, '0.0.0.0', function(err){
  if(err){
    console.log(err)
  }else{
      console.log('Listening on port ' + port);
  }
});



//To avoid unsigned certificate error which can crash demos - This should be done properly once this moves beyond a PoC.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// expose app
exports = module.exports = app;
