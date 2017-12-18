var express = require('express');
var app = express();

app.get('/', function (req, res, next) {
    if (app.locals.count) {
        app.locals.count ++;
    } else {
        app.locals.count = 1;
    }

    res.locals.title = 'appTest';
    res.locals.msg = JSON.stringify(app.settings);
    res.locals.views = req.app.get("views");
    res.locals.test = req.baseUrl;
    console.log(app.settings);
    var renderData = {
        title: 'ejs',
    };
    res.render('testTemplate.html', renderData);
});

app.on('mount', function (parent) {
    console.log('router Mounted');
});


module.exports = app;
