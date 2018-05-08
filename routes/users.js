var express = require('express');
var router = express.Router();
var usuarioController = require('../controllers/usuarioController');
var passport = require('../config/passport');

router.post('/login', passport.authenticate('local'), usuarioController.login);
router.get('/logout', usuarioController.logout);
router.get('/loggedin', usuarioController.loggedIn, usuarioController.sendUser);

module.exports = router;
