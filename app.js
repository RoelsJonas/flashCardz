var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require("compression");
var helmet = require("helmet");
const cors = require("cors");
const {log} = require("mercedlogger");
const flash = require('connect-flash');
const session = require('express-session');

// Configure the dotenv file
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var coursesRouter = require('./routes/courses');
var userRouter = require("./controllers/userController");
var signupRouter = require("./routes/signup");
var loginRouter = require("./routes/login");
var todoRouter = require("./controllers/todoController");
var singoutRouter = require("./routes/logout");
var recoveryRouter = require("./routes/recovery");
var cardRouter = require("./routes/cards");

var app = express();

app.use(compression());

app.use(cors());
app.use(session({
  secret: 'codeforgeek',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static("public"));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/courses', coursesRouter);
app.use("/user", userRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/todos", todoRouter);
app.use("/logout", singoutRouter);
app.use("/recovery", recoveryRouter);
app.use("/cards", cardRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
  console.log("ERROR");
});

module.exports = app;
