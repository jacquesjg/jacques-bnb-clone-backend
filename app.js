require("dotenv").config();

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require("cors");

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log('MONGODB CONNECTED');
  })
  .catch((e) => {
    console.log(e);
  });

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users/usersRouter');
const bookingsRouter = require('./routes/bookings/bookingsRouter');

const app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/bookings', bookingsRouter);

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
  res.json({ message: 'Error', error: err.message });
});

module.exports = app;
