var express = require('express');
var app = express();

app.get('/', function (req, res, next) {
    console.log(app.settings);
    if (app.locals.count) {
        app.locals.count ++;
    } else {
        app.locals.count = 1;
    }

    res.locals.title = 'appTest';
    res.locals.msg = JSON.stringify(app.settings);
    res.locals.views = req.app.get("views");
    res.locals.test = req.baseUrl;
    res.render('appTest');
});

app.on('mount', function (parent) {
    console.log('router Mounted');
    //console.log(parent);
});


module.exports = app;
