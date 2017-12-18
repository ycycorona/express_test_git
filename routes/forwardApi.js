var express = require('express');
var app = express();
var path = require('path');
var proxyGet = require('../middleware/proxyGet');

app.use('/getFlightInfo', proxyGet);


app.use(function(req, res, next){
    res.send('test')
});

app.on('mount', function (parent) {
    console.log('forwardApi Mounted');
    //console.log(parent);
});


module.exports = app;
