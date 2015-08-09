
/**
 * Module dependencies.
 */
var express = require('express')
  , resources = require('./routes/resources')
  , authen = require('./routes/authen')
  , actvs = require('./routes/actvs')
  , attend = require('./routes/attend')
  , mongoose = require('mongoose')
  , bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/ziyuedb', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

var app = express();
// cache content for one day
var oneDay = 86400000;

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public', { maxAge: oneDay }));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Routes
app.use('/resource', resources);
app.use('/authen', authen);
app.use('/actvs', actvs);
app.use('/attend', attend);

module.exports = app;
