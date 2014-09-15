var express = require('express'),
    path = require('path'),
    hbs = require('express-hbs'),
    routes = require('./routes/index'),
    contact = require('./routes/contact'),
    insta = require('./routes/insta'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongo = require('mongoose'),
    app = express();

    // favicon = require('static-favicon'),
    // cookieParser = require('cookie-parser'),


// view engine setup
app.set('view engine', 'hbs');
app.engine('hbs', hbs.express3({
    defaultLayout: __dirname + '/views/layouts/layout.hbs',
    layoutsDir: __dirname + '/views/layouts'
}));
app.set('views', __dirname + '/views');


// app.use(favicon());
// app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(logger('dev'));

//passport middleware init
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/contact', contact);
app.use('/insta', insta);


mongo.connect('mongodb://localhost/renudb');
var Schema = mongo.Schema;
var UserDetail = new Schema({
      username: String,
      password: String
    }, {
      collection: 'renudb'
    });
var UserDetails = mongo.model('renudb', UserDetail);



app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure'
  })
);
 
app.get('/loginFailure', function(req, res, next) {
    var err = new Error('Failed to authenticate');
    res.render('login', {
        message: err.message,
        error: err
    });
});
 
app.get('/loginSuccess', function(req, res, next) {
    res.render('index', {
        message: 'Successfully authenticated'
    });
});

passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    // Auth Check Logic
    UserDetails.findOne({
      'username': username,
    }, function(err, user) {
      if (err) {
        return done(err);
      }
 
      if (!user) {
        return done(null, false);
      }
 
      if (user.password != password) {
        return done(null, false);
      }
 
      return done(null, user);
    });
  });
}));




/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

app.listen(8080, function() {
    console.log("ready captain.");
});