var Usuario = require('../models/usuario');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passwordHash = require('password-hash');

passport.use(new LocalStrategy(
  function(username, password, done) {
    Usuario.where({ username: username }, (err, user) => {
      if (err) { return done(err); }
      user = user[0];
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!passwordHash.verify(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Usuario.read(id, function(err, user) {
    done(err, user);
  });
});

/*passport.use(new Strategy(
  function(username, password, done) {
    Usuario.where({ username: username }, (err, user) => {
      if (err) { return done(err); }
      user = user[0];
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));*/


module.exports = passport;
