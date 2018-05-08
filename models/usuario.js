var db = require('../config/db');
var Usuario = require('seraph-model')(db, 'Usuario');

Usuario.setUniqueKey('username');
Usuario.schema = {
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true }
}

module.exports = Usuario;
