var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//路由
var index = require('./routes/index');
var users = require('./routes/users');
//var test = require('./routes/test');
var appTest = require('./routes/appTest');
var testTemplate = require('./routes/testTemplate');
var testEjs = require('./routes/testEjs');
var ajaxApi = require('./routes/ajaxApi');
var forwardApi = require('./routes/forwardApi');




var app = express();
var ejs = require('ejs');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', ejs.__express);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.all('*', function (req, res, next) {
    res.locals.name = 'ycy';
    next();
});

app.use('/', index);
app.use('/testEjs', testEjs);
app.use('/ajaxApi', ajaxApi);
//app.use('/test', test);
//app.use('/test', appTest);
app.use('/testTemplate', testTemplate);
app.use('/forwardApi', forwardApi);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
