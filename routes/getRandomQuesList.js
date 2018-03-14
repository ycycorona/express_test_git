var express = require('express');
var app = express();
var path = require('path');
var url = require('url');
var eventproxy = require('eventproxy');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var DataBase = require('../middleware/dataBase');


var concurrencyCount = 0;
var allCount = 0;
var requestUrl = 'http://xxjs.dtdjzx.gov.cn/quiz-api/subject_info/randomList';
var list =[];
for(var i=0; i<1; i++) {
    list.push({id: i});
}
Array.prototype.max = function () {
    var max = this[0].firstQuestion;
    for (var i = 1; i < this.length; i++) {
        if (this[i].firstQuestion > max) {
            max = this[i];
        }
    }
    return max
}


//进入详情页，获取文章的基本信息 并发限制
app.use(function (req, res, next) {
    if (true) {
        async.mapLimit(list, 50, function (topicUrl, callback) {

            getOneRequest(requestUrl, callback)
        }, function (err, result) {
            result = result.map(function (oneResult) {

                // 接下来都是 jquery 的用法了
                //var topicHtml = topicPair[1];
                return ({
                    data: JSON.parse(oneResult[1]).data
                });
            });
            var dataBase = new DataBase;
            dataBase.startContect();

            result[0].data.subjectInfoList.forEach(function (item, index, thisArray) {
                console.log(item.subjectTitle);
                dataBase.insert({subject_title: item.subjectTitle});
            });

            dataBase.closeContect();
            res.locals.result = result;
            next();
        });
    }
});

//返回数据给浏览器
app.use(function (req, res, next) {
    res.send(JSON.stringify(res.locals.result, null, 2) );
});


function getOneRequest(url, callBack) {
    concurrencyCount++;
    allCount++;

    if (allCount % 500 === 0 ) {
        console.log('已发请求数量', allCount);
        console.log('当前并发请求数量', concurrencyCount);
    }

    var option = {
        url: url
    };

    request.get(option, function (error, response, body) {
        if (!error && response.statusCode === 200) {

        } else {

        }
        concurrencyCount--;
        callBack(null, [url, body]);

    });

}


module.exports = app;