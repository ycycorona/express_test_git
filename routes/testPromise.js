var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    console.log(process.env.NODE_ENV);
    res.send('resultsasdasddfsdfssdfskjhkjhkjhdfsdsdfsdfdsdfsdff');
});






module.exports = router;
