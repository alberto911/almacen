var db = require('../config/db');
var Receta = require('../models/receta');
var MateriaPrima = require('../models/materiaprima');
var helper = require('./helper');

exports.receta_list = (req, res, next) => {
  db.nodesWithLabel('Receta', (err, nodes) => {
    if (err) return next(err);
    res.json(nodes);
  });
};

exports.proximos_a_caducar = (req, res, next) => {
  exports.getProximos()
    .then(productos => res.json(productos))
    .catch(error => next(error));
};

exports.costo = (req, res, next) => {
  var promises = [];
  const query = "match (n:Receta) return id(n) as id";
  db.query(query, (err, ids) => {
    if (err) return next(err);
    for (id of ids)
      promises.push(exports.getRecipe(id));
    Promise.all(promises)
      .then(r => r.filter(p => p.instancias))
      .then(r => r.map(p => p.instancias.map(i => i.costo).reduce((total,i) => total + i)))
      .then(r => r.reduce((total,i) => total + i))
      .then(total => res.json({costo: total}))
      .catch(error => next(error));
  });
};

exports.costo_caducados = (req, res, next) => {
  const query = "match (n:Caducado {nombre: 'receta'}) return n.total as costo";
  db.query(query, (err, total) => {
    if (err) return next(err);
    res.json(total[0]);
  });
};

exports.receta_create = (req, res, next) => {
  const ingredientes = req.body.ingredientes;
  delete req.body.ingredientes;

  if (!helper.collectionsIncludeValues(req.body.unidad))
    return next();
  req.body.diasCaducidad = parseInt(req.body.diasCaducidad);
  req.body.cantidad = parseFloat(req.body.cantidad);

  Receta.save(req.body, (err, node) => {
    if (err) return next(err);
    var txn = db.batch();
    for (ingrediente of ingredientes)
      txn.relate(node, 'CONTIENE', ingrediente.id, { cantidad: parseFloat(ingrediente.cantidad) });
    txn.commit((err, results) => {
      if (err) return next(err);
      res.json(node);
    });
  });
};

exports.receta_read = (req, res, next) => {
  exports.getRecipe(req.params.id)
    .then(node => res.json(node))
    .catch(error => next(error));
}

exports.receta_update = (req, res, next) => {
  if (!helper.collectionsIncludeValues(req.body.unidad))
    return next();
  const ingredientes = req.body.ingredientes;
  delete req.body.ingredientes;

  req.body.cantidad = parseFloat(req.body.cantidad);
  req.body.diasCaducidad = parseInt(req.body.diasCaducidad);
  req.body.id = parseInt(req.params.id);
  Receta.update(req.body, true, (err, node) => {
    if (err) return next(err);
    db.relationships(req.params.id, 'out', 'CONTIENE', (err, rels) => {
      if (err) return next(err);
      var txn = db.batch();
      for (rel of rels) {
        if (!ingredientes.find(i => i.id == rel.end && i.cantidad == rel.properties.cantidad)) {
          txn.rel.delete(rel);
        }
      }
      for (i of ingredientes) {
        if (!rels.find(rel => i.id == rel.end && i.cantidad == rel.properties.cantidad)) {
          txn.relate(node, 'CONTIENE', i.id, { cantidad: parseFloat(i.cantidad) });
        }
      }
      txn.commit((err, results) => {
        if (err) return next(err);
        res.json(node);
      });
    });
  });
};

exports.receta_delete = (req, res, next) => {
  Receta.read(req.params.id, (err, node) => {
    if (err || !node) return next(err);
    var txn = db.batch();

    // Borrar todas las instancias y sus conexiones
    if (node.instancias) {
      const instanceIds = node.instancias.map(x => x.id);
      for (id of instanceIds)
        txn.delete(id, true);
    }

    txn.commit((err, results) => {
      if (err) return next(error);
      db.delete(req.params.id, true, (err) => {
        if (err) return next(err);
        res.json(req.params.id);
      });
    });
  });
};

exports.create_instance = (req, res, next) => {
  exports.getRecipe(req.params.id)
    .then((receta) => {
      const ingredient_ids = receta.ingredientes.map(i => parseInt(i.id));
      req.body.cantidad = parseFloat(req.body.cantidad);

      // Obtener las cantidades disponibles de cada ingrediente
      const query = "match (n:MateriaPrima)-[:HAY]->(i:MateriaPrimaInstance) "
                  + "where id(n) in {ids} return id(n) as id, sum(toFloat(i.cantidad)) as cantidad";
      db.query(query, { ids: ingredient_ids }, (err, cantidadesDisponibles) => {
        if (err) return next(err);
        var factor = req.body.cantidad / receta.cantidad;
        var cantidadesNecesarias = receta.ingredientes.map(i => ({ id: i.id, cantidad: i.cantidad * factor }));
        for (cantidadNecesaria of cantidadesNecesarias) {
          var cantidadDisponible = cantidadesDisponibles.find(cd => cd.id == cantidadNecesaria.id);
          if (!cantidadDisponible || cantidadDisponible.cantidad < cantidadNecesaria.cantidad) {
            return next("No hay suficientes ingredientes");
          }
        }

        // Actualizar cantidades de ingredientes
        for (let i = 0; i < cantidadesNecesarias.length; ++i) {
          MateriaPrima.read(cantidadesNecesarias[i].id, (err, producto) => {
            if (err) return next(error);
            var j = 0;
            while (cantidadesNecesarias[i].cantidad > 0) {
              var cantidadUtilizada = cantidadesNecesarias[i].cantidad >= producto.instancias[j].cantidad ? producto.instancias[j].cantidad : cantidadesNecesarias[i].cantidad;
              cantidadesNecesarias[i].cantidad -= cantidadUtilizada;
              producto.instancias[j].cantidad -= cantidadUtilizada;
              if (producto.instancias[j].cantidad == 0) {
                const nodeToDelete = producto.instancias.splice(j, 1);
                db.delete(nodeToDelete, true, (err) => { if (err) return next(err) });
              }
              else
                ++j;
            }
            MateriaPrima.save(producto, false, (err, p) => { if (err) return next(err) });
          });
        }

        // Crear instancia
        const instance = {
          cantidad: req.body.cantidad,
          fechaCaducidad: helper.todayPlusDays(receta.diasCaducidad)
        }
        Receta.push(receta, 'instancias', instance, (err, inst) => {
          if (err) console.log(error);
          res.json(inst);
        });
      });
    })
    .catch(error => next(error));
};

exports.delete_instance = (req, res, next) => {
  db.delete(req.params.iid, true, (err) => {
    if (err) return next(err);
    res.json(req.params.iid);
  });
};

exports.getProximos = () => {
  const query = "match (p:ProductoElaborado)<-[HAY]-(r:Receta) "
              + "where p.fechaCaducidad < {fecha} "
              + "return id(p) as id, r.nombre as nombre, p.cantidad as cantidad, r.unidad as unidad, p.fechaCaducidad as fechaCaducidad "
              + "order by fechaCaducidad";
  return new Promise((resolve, reject) => {
    db.query(query, { fecha: helper.todayPlusDays(3) }, (err, productos) => {
      if (err) return reject(err);
      resolve(productos);
    });
  });
};

exports.getRecipe = (id) => {
  return new Promise((resolve, reject) => {
    Receta.read(id, (err, node) => {
      if (err || !node) return reject(err);
      db.readLabels(node, (err, labels) => {
        if (err || !labels.includes('Receta')) return reject(err);
        db.relationships(node, 'out', 'CONTIENE', (err, rels) => {
          if (err) return reject(err);
          var txn = db.batch();
          for (let i = 0; i < rels.length; ++i) {
            txn.read(rels[i].end, (err, product) => {
              rels[i].materiaprima = product;
            });
          }
          txn.commit((err, results) => {
            if (err) return reject(err);
            const costos = rels.map(r => (r.properties.cantidad * r.materiaprima.costo) / r.materiaprima.cantidad);
            node.costo = costos.reduce((total, x) => total + x);

            if (node.instancias) {
              for (let i = 0; i < node.instancias.length; ++i)
                node.instancias[i].costo = (node.instancias[i].cantidad * node.costo) / node.cantidad
            }

            rels = rels.map(r => ({ id: String(r.materiaprima.id), cantidad: r.properties.cantidad, nombre: r.materiaprima.nombre, unidad: r.materiaprima.unidad }));
            node.ingredientes = rels;
            resolve(node);
          });
        });
      });
    });
  });
};
