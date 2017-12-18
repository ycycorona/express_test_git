var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    var renderData = {
        title: 'ejs',
        msg: '扩展名是ejs'
    };
    res.render('testEjs.ejs', renderData);
});



module.exports = router;
