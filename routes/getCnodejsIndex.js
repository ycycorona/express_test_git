var express = require('express');
var app = express();
var path = require('path');
var url = require('url');
var eventproxy = require('eventproxy');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var concurrencyCount = 0;
//测试一条链接
app.get('/testOne', function (req, res, next) {
    var Url = 'https://cnodejs.org/topic/5a376704d1536726354b7e9f';

    var option = {
        url: Url
    };
    request.get(option, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var topicUrl = Url;
            var $ = cheerio.load(body);
            var result = {
                title: $('.topic_full_title').text().trim(),
                href: topicUrl,
                comment1: $('.reply_content').eq(0).text().trim()
            };
            res.send(JSON.stringify(result, null, 2));
        } else {
            res.send('获取失败');
        }
    });
});





//获取首页的文章URL列表
app.get('/getIndexUrlList/:isNeedDeep', function (req, res, next) {
    var isNeedDeep = req.params.isNeedDeep === '1';
    var cnodeUrl = 'https://cnodejs.org/?tab=all&page=2';

    var option = {
        url: cnodeUrl
    };
    request.get(option, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.locals.topicUrls = getUrlFromIndexHtml(cnodeUrl, body);
            if(isNeedDeep === true) {
                next();
            } else {
                res.send(res.locals.topicUrls);
            }
        } else {

        }
    });
});

//进入详情页，获取文章的基本信息 并发限制
app.use(function (req, res, next) {
    if (res.locals.topicUrls !== '') {
        async.mapLimit(res.locals.topicUrls, 3, function (topicUrl, callback) {
            getOneRequest(topicUrl, callback)
        }, function (err, result) {
            result = result.map(function (topicPair) {
                // 接下来都是 jquery 的用法了
                var topicUrl = topicPair[0];
                var topicHtml = topicPair[1];
                var $ = cheerio.load(topicHtml);
                return ({
                    title: $('.topic_full_title').text().trim(),
                    href: topicUrl,
                    comment1: $('.reply_content').eq(0).text().trim()
                });
            });
            res.locals.topics = result;
            next();
        });
    }
});

//进入详情页，获取文章的基本信息 并发
/*app.use(function (req, res, next) {
    if (res.locals.topicUrls !== '') {
        //得到一个 eventproxy 的实例
        var ep = new eventproxy();

        //命令 ep 重复监听 topicUrls.length 次（在这里也就是 40 次） `topic_html` 事件再行动
        //res.locals.topicUrls.length
        ep.after('topic_html', res.locals.topicUrls.length, function (topics) {
            // topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那 40 个 pair
            // 开始行动
            topics = topics.map(function (topicPair) {
                // 接下来都是 jquery 的用法了
                var topicUrl = topicPair[0];
                var topicHtml = topicPair[1];
                var $ = cheerio.load(topicHtml);
                return ({
                    title: $('.topic_full_title').text().trim(),
                    href: topicUrl,
                    comment1: $('.reply_content').eq(0).text().trim()
                });
            });
            res.locals.topics = topics;
            next();
        });

        res.locals.topicUrls.forEach(function (topicUrl) {
            var option = {
                url: topicUrl
            };
            request.get(option, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    ep.emit('topic_html', [topicUrl, body]);
                } else {
                    ep.emit('topic_html', [topicUrl, body]);
                }
            });
        });

    }
});*/

//返回数据给浏览器
app.use(function (req, res, next) {
    res.send(JSON.stringify(res.locals, null, 2) );
});

/**
 * @desc 通过传入主页的html页面 获取首页的链接列表
 * @param html
 * @returns {Array}
 */
function getUrlFromIndexHtml(cnodeUrl, html) {
    var topicUrls = [];
    var $ = cheerio.load(html);
    // 获取首页所有的链接
    $('#topic_list .topic_title').each(function (idx, element) {
        var $element = $(element);
        // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
        // 我们用 url.resolve 来自动推断出完整 url，变成
        // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
        // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
        var href = url.resolve(cnodeUrl, $element.attr('href'));
        topicUrls.unshift(href);
    });
    return topicUrls;
}

function getOneRequest(url, callBack) {

    console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url);
    var option = {
        url: url
    };
    concurrencyCount++;
    request.get(option, function (error, response, body) {
        if (!error && response.statusCode === 200) {

        } else {

        }
        callBack(null, [url, body]);
        concurrencyCount--;
    });

}















module.exports = app;