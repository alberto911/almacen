var db = require('../config/db');
var MateriaPrimaInstance = require('seraph-model')(db, 'MateriaPrimaInstance');

MateriaPrimaInstance.schema = {
  cantidad: { type: Number, min: 0, required: true },
  fechaCaducidad: { type: Date, required: true }
}

module.exports = MateriaPrimaInstance;
