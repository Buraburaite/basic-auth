const Router = require('express').Router;
const bcrypt = require('bcrypt');

const authRoutes = Router(); //Is this a factory function? Probably...
const User = require('../models/user-model.js');

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup-view');
});

authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if ([username, password].includes('')) {
    res.render('auth/signup-view.ejs', {
      errorMessage : 'Please fill out both username and password foo\'!'
    });
    return;
  }

  User.findOne({ username: username }, { username: 1 }, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }

    if (foundUser) {
      res.render('auth/signup-view.ejs', {
        errorMessage: 'The username already exists'
      });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const userInfo = {
      username : username,
      password : hashPass
    };

    theUser = new User(userInfo);

    theUser.save((err) => {
      res.redirect('/');
    });

  });
});

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login-view');
});

module.exports = authRoutes;
