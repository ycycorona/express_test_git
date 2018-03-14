var mysql = require('mysql');

//构造函数
function SqlConnection() {

    this.mysqlConnectionApp = mysql.createConnection({
       host     : 'localhost',
       user     : 'root',
       password : '123456',
       database : 'lighthouse'
    });


    SqlConnection.prototype.startContect = function () {
        this.mysqlConnectionApp.connect();
    };
    SqlConnection.prototype.closeContect = function () {
        this.mysqlConnectionApp.end();
    };
    SqlConnection.prototype.queryTest = function () {
        this.mysqlConnectionApp.query('SELECT * FROM tbl_question_item', function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results);
        });
    };
    SqlConnection.prototype.checkValueExist = function (name, value) {
        return new Promise((resolve, reject) => {
            var sql = 'SELECT ?? FROM `tbl_question_item` WHERE ?? = ?';
            this.mysqlConnectionApp.query(sql, [name,name,value], function (error, results, fields) {
                if (error) {
                    reject(error);
                }

                //console.log('The solution is: ', JSON.stringify(results) );
                if (results.length > 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            });
        })
    };

    SqlConnection.prototype.insert = function (dataObj) {
        var sql = 'INSERT INTO `tbl_question_item` SET ?';
        this.mysqlConnectionApp.query(sql, dataObj, function (error, results) {
            if (error) throw error;
            console.log('The solution is: ', results);
        })
    }

    SqlConnection.prototype.update = function (dataObj, value) {
        var sql = 'UPDATE `tbl_question_item` SET ? WHERE `subject_title` = ?';
        this.mysqlConnectionApp.query(sql, [dataObj, value], function (error, results) {
            if (error) throw error;
            console.log('The solution is: ', results);
        })
    }
}

/*var test = new SqlConnection();
test.startContect();
test.update({'subject_title': 'test3'}, 'test2');*/

//test.closeContect();

module.exports = SqlConnection;