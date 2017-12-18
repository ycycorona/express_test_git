var express = require('express');
var app = express();
var path = require('path');
app.get('/getTestDataByJq', function (req, res, next) {
    res.download(path.join(__dirname, '../downloadSource/imgs/123.jpg'), '测试图片.jpg', function (err) {
        if (err) {
            console.log(err);
        } else {

        }
    });
});
app.post('/getTestDataByJq', function (req, res, next) {
    console.log(req.body, req.query, req.cookies);
    res.jsonp(req.body);
});

app.on('mount', function (parent) {
    console.log('ajaxApi Mounted');
    //console.log(parent);
});


module.exports = app;
