var express = require('express');
var app = express();
var request = require('request');

function proxtGet(req, res, next) {
    console.log('进入proxtGet');
    var encodeFormData = {
        flightDate: '2017-12-19',
        sortType: 1
    };
    var option = {
        headers: {
            //'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
            //'Accept-Encoding': 'gzip, deflate',
            'Accept': 'application/json'
        },
        url: 'http://foc.qdairlines.com//flightInfo/mobileList.do',
        form:encodeFormData
    };
    request.post(option, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.locals.forwardApiResult = JSON.parse(body);
        }
        next();
    });


}

module.exports = proxtGet;