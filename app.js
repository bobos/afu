
/**
 * Module dependencies.
 */
var express = require('express')
  , resources = require('./routes/resources')
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

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Routes
app.use('/resource', resources);

module.exports = app;
