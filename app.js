//visit npmjs website & search for package then you will documentation about the package

//default package installed by expressjs generator
require("dotenv/config");
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let app = express();

//package installed for this project
let session = require('express-session');
let expressSanitizer = require('express-sanitizer');
let dosPrev = require('ddos');

//files made for this project
let { COOKIES_AGE } = require('./app/config');
let indexRouter = require('./app/routes/index');
let usersRouter = require('./app/routes/users');
let teamsRouter = require('./app/routes/teams');
let database = require('./app/database/connect');

//dos attack preventtion
const noDos = new dosPrev({
	burst: 15,
	limit: 25,
	maxCount: 35
});

//connecting to database
database.connect();
//defining log method
const logMethod = (process.env.NODE_ENV === 'PRODUCTION') ? 'combined' : 'dev';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//code generated by expressjs
app.use(logger(logMethod));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//read expressjs documentation
app.disable('etag');
app.disable('x-powered-by');

//special config for this project
app.use(noDos.express);
app.use(expressSanitizer());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    httpOnly: false,
    path: '/',
    saveUninitialized: false,
    cookie: {
    	secure: false,
    	maxAge: COOKIES_AGE,
    }
}));

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/teams', teamsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'DEV' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


console.log(`Server running on Port ${process.env.PORT || 3000}`);
module.exports = app;
