var express = require('express');
var app = express();
var path = require('path');
var proxyGet = require('../middleware/proxyGet');
var getQueryParams = require('../middleware/getQueryParams');

app.use(getQueryParams);

app.use('/getFlightInfo', proxyGet);


app.use(function(req, res, next){
    if (typeof res.locals.forwardApiResult !== 'undefined') {
        res.json(res.locals.forwardApiResult);
    } else {
        res.send('get fail');
    }

});

app.on('mount', function (parent) {
    console.log('forwardApi Mounted');
    //console.log(parent);
});


module.exports = app;
