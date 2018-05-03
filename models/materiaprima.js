var db = require('seraph')({ pass: 'Ariel' });
var MateriaPrima = require('seraph-model')(db, 'MateriaPrima');
var MateriaPrimaInstance = require('./materiaprima-instance');

MateriaPrima.setUniqueKey('nombre');
MateriaPrima.schema = {
  nombre: { type: String, required: true, trim: true },
  costo: { type: Number, min: 0, required: true },
  cantidad: { type: Number, min: 0, required: true },
  unidad: { type: String }
}

MateriaPrima.compose(MateriaPrimaInstance, 'instancias', 'HAY', { many: true, orderBy: 'fechaCaducidad' });
module.exports = MateriaPrima;
