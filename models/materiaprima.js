var db = require('../config/db');
var MateriaPrima = require('seraph-model')(db, 'MateriaPrima');
var MateriaPrimaInstance = require('./materiaprima-instance');
var schedule = require('node-schedule');

MateriaPrima.setUniqueKey('nombre');
MateriaPrima.schema = {
  nombre: { type: String, required: true, trim: true },
  costo: { type: Number, min: 0, required: true },
  cantidad: { type: Number, min: 0, required: true },
  unidad: { type: String }
}

MateriaPrima.compose(MateriaPrimaInstance, 'instancias', 'HAY', { many: true, orderBy: 'fechaCaducidad' });

const eliminarCaducados = () => {
  const today = new Date().setHours(0, 0, 0, 0);
  const query = "match (n:MateriaPrima)-[:HAY]->(i:MateriaPrimaInstance) where i.fechaCaducidad < {fecha} "
              + "return id(i) as id, ((i.cantidad * n.costo) / n.cantidad) as costo";
  db.query(query, { fecha: today }, (err, caducados) => {
    if (err) return console.error(err);
    var total = 0;
    var txn = db.batch();
    for (c of caducados) {
      total += c.costo;
      txn.delete(c, true);
    }
    txn.commit((err, results) => {
      if (err) return console.error(err);
      const updateQuery = "match (n:Caducado {nombre: 'materiaprima'}) set n.total = n.total + {total} return n";
      db.query(updateQuery, { total : total }, (err, node) => {
        if (err) return console.error(err);
        console.log(node);
      });
    });
  });
};

var j = schedule.scheduleJob('0 0 * * *', eliminarCaducados);

module.exports = MateriaPrima;
