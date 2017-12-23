var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    var renderData = {
        title: 'ejs',
        msg: '空'
    };
    res.render('testEjs.ejs', renderData);
});

router.get('/promise', function(req, res, next) {
    var renderData = {
        title: 'ejs',
        msg: 'promise'
    };
    res.render('testEjs.ejs', renderData);
});




module.exports = router;
