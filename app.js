var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(require('./routers/router'));

app.listen(18881, function() {
    console.log('ready on port 18881');
});
