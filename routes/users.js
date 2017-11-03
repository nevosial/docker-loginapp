var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});


router.post('/login',
  passport.authenticate('local', {failureRedirect:'/users/login', failureFlash:'Invalid username or password'}),
  function(req, res) {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
  });


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else{
        return done(null, false, {message:'Invalid Password'});
      }
    })
  });
}));


router.post('/register', function(req, res, next) {
  console.log(req.body.name);
  console.log(req.params.email);

  var name = req.body.name;
  var email = req.params.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;


  console.log(name);
  console.log(email);

  //form validation
  req.checkBody('name', 'Name is a required field').notEmpty();
  req.checkBody('email', 'Please enter your email address').notEmpty();
  req.checkBody('email', 'Please enter valid email address').isEmail();
  req.checkBody('username', 'Username is a required field').notEmpty();
  req.checkBody('password', 'Password is required field').notEmpty();
  req.checkBody('password2', 'the passwords must match').equals(req.body.password);


  //errors
  var errors = req.validationErrors();

  if(errors){
    //console.log('errors')
    res.render('register' , {errors: errors});
  }else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });
    req.flash('success', 'You are now registered. Please login again.')
    res.location('/');
    res.redirect('/');
  }


});


router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are now logged out.');
  res.redirect('/users/login');
});



module.exports = router;
