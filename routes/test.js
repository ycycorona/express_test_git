var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');
/*/!* GET home page. *!/
console.log(path.join(__dirname, 'public'));



router.get('/', function (req, res, next) {
    console.log(router.mountpath);
    res.send('test' + router.mountpath);
});

router.on('mount', function (parent) {
    console.log('router Mounted');
    console.log(parent);
});*/

router.get('/', function (req, res, next) {


    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '123456',
        database : 'lighthouse'
    });

    connection.connect();

    connection.query('SELECT * FROM tbl_question_item', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);

        res.send(results);
    });



});





module.exports = router;

