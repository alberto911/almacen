var db = require('seraph')({ pass: 'Ariel' });
var ProductoElaborado = require('seraph-model')(db, 'ProductoElaborado');

ProductoElaborado.schema = {
  cantidad: { type: Number, min: 0, required: true },
  fechaCaducidad: { type: Date, required: true }
}

module.exports = ProductoElaborado;
