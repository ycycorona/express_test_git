var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
console.log(path.join(__dirname, 'public'));



router.get('/', function (req, res, next) {
    console.log(router.mountpath);
    res.send('test' + router.mountpath);
});

router.on('mount', function (parent) {
    console.log('router Mounted');
    console.log(parent);
});


module.exports = router;

