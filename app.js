var express = require('express'),
    path = require('path'),
    hbs = require('express-handlebars'),
    index = require('./routes/index'),
    contact = require('./routes/contact'),
    insta = require('./routes/insta'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongo = require('mongoose'),
    expressValidator = require('express-validator'),
    app = express();

    // favicon = require('static-favicon'),
    // cookieParser = require('cookie-parser'),


/* configure Express */
// view engine setup
app.engine('hbs', hbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');

// app.use(favicon());
// app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(expressValidator());
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/contact', contact);
app.use('/insta', insta);


/* Passport and MongoDB */
//passport middleware init
app.use(passport.initialize());
app.use(passport.session());

mongo.connect('mongodb://localhost/renudb');
var db = mongo.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

var Schema = mongo.Schema,
  UserDetail = new Schema({
    username: String,
    password: String
  }, {
    collection: 'renudb'
  }),
  UserDetails = mongo.model('renudb', UserDetail);

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


/* Login Handlers */
app.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/login/success',
    failureRedirect: '/login/failure'
  })
);
 
app.get('/login/failure', function(req, res, next) {
  var err = new Error('Failed to authenticate');
  res.render('login', {
    message: err.message,
    error: err
  });
});
 
app.get('/login/success', function(req, res, next) {
  res.render('index', {
    message: 'Successfully authenticated'
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}



/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    err.title = 'Oops, an error!';
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          title: err.title,
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
      title: err.title,
      message: err.message,
      error: err
    });
});


module.exports = app;

app.listen(8080, function() {
    console.log("ready captain.");
});