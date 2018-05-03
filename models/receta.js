var db = require('seraph')({ pass: 'Ariel' });
var Receta = require('seraph-model')(db, 'Receta');
var ProductoElaborado = require('./productoelaborado');

Receta.setUniqueKey('nombre');
Receta.schema = {
  nombre: { type: String, required: true, trim: true },
  diasCaducidad: { type: Number, min: 0, required: true },
  cantidad: { type: Number, min: 0, required: true },
  unidad: { type: String }
}

Receta.compose(ProductoElaborado, 'instancias', 'HAY', { many: true, orderBy: 'fechaCaducidad' });
module.exports = Receta;
