var db = require('seraph')({ pass: 'Ariel' });
var Receta = require('seraph-model')(db, 'Receta');
var ProductoElaborado = require('./productoelaborado');
var recetaController = require('../controllers/recetaController');
var schedule = require('node-schedule');

Receta.setUniqueKey('nombre');
Receta.schema = {
  nombre: { type: String, required: true, trim: true },
  diasCaducidad: { type: Number, min: 0, required: true },
  cantidad: { type: Number, min: 0, required: true },
  unidad: { type: String }
}

Receta.compose(ProductoElaborado, 'instancias', 'HAY', { many: true, orderBy: 'fechaCaducidad' });

const eliminar_caducados = () => {
  const today = new Date().setHours(0, 0, 0, 0);
  const query = "match (n:Receta)-[:HAY]->(i:ProductoElaborado) where i.fechaCaducidad < {fecha}"
              + " return id(i) as idProducto, id(n) as idReceta, i.cantidad / n.cantidad as factor";
  db.query(query, { fecha: today }, (err, caducados) => {
    if (err) return console.error(err);
    var promises = [];
    var txn = db.batch();
    for (c of caducados) {
      promises.push(recetaController.getRecipe(c.idReceta));
      txn.delete(c.idProducto, true);
    }

    Promise.all(promises)
      .then(arr => arr.map(x => x.costo))
      .then(arr => arr.reduce((total, x, i) => total + x * caducados[i].factor, 0))
      .then(costo => {
        txn.commit((err, results) => {
          if (err) return console.error(err);
          const updateQuery = "match (n:Caducado {nombre: 'receta'}) set n.total = n.total + {total} return n";
          db.query(updateQuery, { total : costo }, (err, node) => {
            if (err) return console.error(err);
            console.log(node);
          });
        });
      })
      .catch(err => console.error(err));
  });
};

var j = schedule.scheduleJob('0 0 * * *', eliminar_caducados);

module.exports = Receta;
