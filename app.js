var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var almacenRouter = require('./routes/almacen');

var app = express();

/*var MateriaPrima = require('./models/materiaprima');
var instancia2 = {
  cantidad: 2,
  fechaCaducidad: '2019/05/26'
};
MateriaPrima.push(15, 'instancias', instancia2, function(err, res) {
  if (err) throw err;
  console.log(res);
});
var ProductoElaborado = require('./models/productoelaborado');
var producto = {
  nombre: 'Guacamole',
  diasCaducidad: 3,
  cantidad: 0.5,
  unidad: 'kg'
};
ProductoElaborado.save(producto, (err, res) => {
  if (err) throw err;
  console.log(res);
});*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', almacenRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
