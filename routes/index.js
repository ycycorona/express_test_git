var express = require('express');
var app = express();

/* GET home page. */
app.get('/', function(req, res, next) {
    app.render('layout.pug', function(err, renderedData) {
        res.send( renderedData );
    });
});

module.exports = app;
