var express = require('express');
var app = express();

function proxtGet(req, res, next) {
    console.log('进入proxtGet');

    next();
}

module.exports = proxtGet;