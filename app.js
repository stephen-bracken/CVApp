var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var logger = require('morgan');

var publicRouter = require('./routes/public');
var cvRouter = require('./routes/cv');
var usersRouter = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '79d945c1d46ae8a0eb5c555ca42e9134edda2297357e0e72ae17611eeecbfcc1',
  resave: true,
  saveUninitialized: false,
  proxy: false
}));

app.use('/', publicRouter);
app.use('/cv', loginRequired, cvRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

app.use(function(req,res,next){
  res.locals.user = req.session.user;
  next();
});

function loginRequired(req, res, next) {
  if (typeof req.session.user == 'undefined') {
    return res.status(401).render("unauthenticated");
  }

  next();
}

module.exports = app;
