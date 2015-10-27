// server.js

var express=require('express');
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var session=require('express-session');
var nodemailer=require('nodemailer');
var MemoryStore=require('connect').session.MemoryStore;
var path=require('path');
var app=express();

// import data layer
var dbPath='mongodb://localhost/tenacious-turtle';
var mongoose=require('mongoose');
var User=require('./models/user')
var config={
  mail: require('./config/mail')
};

// import accounts
//var Account = require('./models/Account')(config, mongoose, nodemailer);

// Import the models
var models = {
  Account: require('./models/Account')(config, mongoose, nodemailer)
};

// all environments
app.set('port',process.env.PORT || 3000);
app.set('view engine', 'jade');
//app.use(express.limit('1mb'));
app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "Tenacious secret key", 
  store: new MemoryStore()
}));

mongoose.connect(dbPath, function onMongooseError(err){
  if(err)throw err;
});

// routes
app.get('/', function(req, res){
    res.render("index.jade", {layout:false});
});

// login
app.post('/login', function(req, res) {
  console.log('login request');
  var email = req.param('email', null);
  var password = req.param('password', null);

  if ( null == email || email.length < 1 
      || null == password || password.length < 1 ) {
    res.send(400);
    return;
  }

  models.Account.login(email, password, function(account) {
    if ( !account ) {
      res.send(401);
      return;
    }
    console.log('login was successful');
    req.session.loggedIn=true;
    req.session.accountId=account._id;
    res.send(200);
  });
});

// register
app.post('/register', function(req, res) {
  var firstName = req.param('firstName', '');
  var lastName = req.param('lastName', '');
  var email = req.param('email', null);
  var password = req.param('password', null);

  if ( null == email || null == password ) {
    res.send(400);
    return;
  }

  models.Account.register(email, password, firstName, lastName);
  res.send(200);
});

// authenticate
app.get('/account/authenticated', function(req, res) {
  if ( req.session.loggedIn ) {
    res.send(200);
  } else {
    res.send(401);
  }
});

app.get('/accounts/:id/activity', function(req, res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  models.Account.findById(accountId, function(account) {
    res.send(account.activity);
  });
});

app.get('/accounts/:id/status', function(req, res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  models.Account.findById(accountId, function(account) {
    res.send(account.status);
  });
});

app.post('/accounts/:id/status', function(req, res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  models.Account.findById(accountId, function(account) {
    status = {
      name: account.name,
      status: req.param('status', '')
    };
    account.status.push(status);

    // Push the status to all friends
    account.activity.push(status);
    account.save(function (err) {
      if (err) {
        console.log('Error saving account: ' + err);
      }
    });
  });
  res.send(200);
});

app.get('/accounts/:id', function(req, res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  models.Account.findById(accountId, function(account) {
    res.send(account);
  });
});

// forgotpassword
app.post('/forgotpassword', function(req, res) {
  var hostname = req.headers.host;
  var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
  var email = req.param('email', null);
  if ( null == email || email.length < 1 ) {
    res.send(400);
    return;
  }

  models.Account.forgotPassword(email, resetPasswordUrl, function(success){
    if (success) {
      res.send(200);
    } else {
      // Username or password not found
      res.send(404);
    }
  });
});

// resetpassword
app.get('/resetPassword', function(req, res) {
  var accountId = req.param('account', null);
  res.render('resetPassword.jade', {locals:{accountId:accountId}});
});
app.post('/resetPassword', function(req, res) {
  var accountId = req.param('accountId', null);
  var password = req.param('password', null);
  if ( null != accountId && null != password ) {
    models.Account.changePassword(accountId, password);
  }
  res.render('resetPasswordSuccess.jade');
});

// register routes
app.use('/api',require('./routes/routes').router);

// start server
app.listen(app.get('port'),function(){
  console.log('Magic happens on port ' + app.get('port'));
});