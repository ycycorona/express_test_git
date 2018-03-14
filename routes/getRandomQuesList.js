var express = require('express');
var app = express();
var path = require('path');
var url = require('url');
var eventproxy = require('eventproxy');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var DataBase = require('../middleware/dataBase');
var validInsert = 0

var concurrencyCount = 0;
var allCount = 0;
var requestUrl = 'http://xxjs.dtdjzx.gov.cn/quiz-api/subject_info/randomList';
var list =[];
for(var i=0; i<500; i++) {
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
            //console.log(result)

            result = result.map(function (oneResult) {

                // 接下来都是 jquery 的用法了
                //var topicHtml = topicPair[1];
                return ({
                    data: oneResult[1].data
                });
            });
            var dataBase = new DataBase;
            dataBase.startContect();
            result.forEach(function(pItem,pIndex,pThisArray){
                pItem.data.subjectInfoList.forEach(function (item, index, thisArray) {
                    //console.log(item.subjectTitle);
                    dataBase.checkValueExist('subject_title', item.subjectTitle)
                        .then((checkResult) => {
                            if (!checkResult) {
                                dataBase.insert({
                                    subject_title: item.subjectTitle,
                                    option_a: item.optionInfoList[0].optionTitle,
                                    option_b: item.optionInfoList[1].optionTitle,
                                    option_c: item.optionInfoList[2].optionTitle,
                                    option_d: item.optionInfoList[3].optionTitle,
                                });
                                validInsert++;
                            } else {
                                //console.log(optionInfoList[0].optionTitle, item.subjectTitle)
/*                                dataBase.update({
                                    subject_title: item.subjectTitle,
                                    option_a: item.optionInfoList[0].optionTitle,
                                    option_b: item.optionInfoList[1].optionTitle,
                                    option_c: item.optionInfoList[2].optionTitle,
                                    option_d: item.optionInfoList[3].optionTitle,
                                }, item.subjectTitle);*/
                            }
                        })
                        .catch((error) => {

                        })
                        .then(() => {
                            //console.log('结束');
                            if((thisArray.length === index+1) && (pThisArray.length === pIndex+1)) {
                                console.log('next')
                                next();
                            }

                        });
                });
            });



            //dataBase.closeContect();
            //res.locals.result = result;

        });
    }
});

//返回数据给浏览器
app.use(function (req, res, next) {
    res.send('操作完成，有效插入：' + validInsert);
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
        callBack(null, [url, JSON.parse(body)]);

    });

}


module.exports = app;