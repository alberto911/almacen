var db = require('../config/db');
var Receta = require('seraph-model')(db, 'Receta');
var ProductoElaborado = require('./productoelaborado');
var recetaController = require('../controllers/recetaController');
var schedule = require('node-schedule');
var mailer = require('../config/mailer');

Receta.setUniqueKey('nombre');
Receta.schema = {
  nombre: { type: String, required: true, trim: true },
  diasCaducidad: { type: Number, min: 0, required: true },
  cantidad: { type: Number, min: 0, required: true },
  unidad: { type: String }
}

Receta.compose(ProductoElaborado, 'instancias', 'HAY', { many: true, orderBy: 'fechaCaducidad' });

const eliminarCaducados = () => {
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

const enviarMail = () => {
  recetaController.getProximos()
    .then(productos => {
      var html = '<p>Hola, a continuación encontrarás una lista de los productos elaborados próximos a caducar:</p><ul>';
      for (p of productos)
        html += `<li>${p.nombre}: ${p.cantidad} ${p.unidad}, caduca ${new Date(p.fechaCaducidad).toLocaleDateString()}</li>`
      html += '</ul>';
      mailer.mailOptions.html = html;

      db.query('match (n:Usuario) return n.email as email', (err, emails) => {
        if (err) return console.error(err);
        mailer.mailOptions.to = emails.map(x => x.email).join();

        mailer.transporter.sendMail(mailer.mailOptions, function(error, info){
          if (error) return console.error(error);
          console.log('Email sent: ' + info.response);
        });
      });
    })
    .catch(err => console.error(err));
};

schedule.scheduleJob('0 0 * * *', eliminarCaducados);
schedule.scheduleJob('0 0 */3 * *', enviarMail);

module.exports = Receta;
