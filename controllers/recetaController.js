var db = require('seraph')({ pass: 'Ariel' });
var Receta = require('../models/receta');
var collections = require('../client/src/collections.js');

const collectionsIncludeValues = (unidad) => (
  collections.unidades.includes(unidad)
);

exports.receta_list = (req, res, next) => {
  db.nodesWithLabel('Receta', (err, nodes) => {
    if (err) return next(err);
    res.json(nodes);
  });
};

exports.receta_create = (req, res, next) => {
  const ingredientes = req.body.ingredientes;
  delete req.body.ingredientes;

  if (!collectionsIncludeValues(req.body.unidad))
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
  Receta.read(req.params.id, (err, node) => {
    if (err || !node) return next(err);
    db.relationships(node, 'out', 'CONTIENE', (err, rels) => {
      if (err) return next(err);
      var txn = db.batch();
      for (let i = 0; i < rels.length; ++i) {
        txn.read(rels[i].end, (err, product) => {
          rels[i].materiaprima = product;
        });
      }
      txn.commit((err, results) => {
        if (err) return next(err);
        rels = rels.map(r => ({ id: String(r.materiaprima.id), cantidad: r.properties.cantidad, nombre: r.materiaprima.nombre, unidad: r.materiaprima.unidad }));
        node.ingredientes = rels;
        res.json(node);
      });
    });
  });
}

exports.receta_update = (req, res, next) => {
  /*if (!collectionsIncludeValues(req.body.unidad))
    return next();
  const ingredientes = req.body.ingredientes;
  delete req.body.ingredientes;

  db.relationships(req.params.id, 'out', 'CONTIENE', (err, rels) => {
    if (err) return next(err);
    var txn = db.batch();
    for (rel of rels) {
      if (!ingredientes.find(i => i.id == rel.end && i.cantidad == rel.properties.cantidad))
        txn.rel.delete(rel);
    }
    for (i of ingredientes) {
      if (!rels.find(rel => i.id == rel.end && i.cantidad == rel.properties.cantidad))
        txn.relate();
    }
  })

  req.body.costo = parseFloat(req.body.costo);
  req.body.cantidad = parseFloat(req.body.cantidad);
  req.body.id = parseInt(req.params.id);
  MateriaPrima.update(req.body, true, (err, node) => {
    if (err) return next(err);
    if (categoria != categoria_anterior) {
      db.label(req.params.id, categoria, (err) => {
        if (err) return next(err);
        db.removeLabel(req.params.id, categoria_anterior, (err) => {
          if (err) return next(err);
          res.json(node);
        });
      });
    }
    else
      res.json(node);
  });*/
};

/*exports.receta_delete = (req, res, next) => {
  MateriaPrima.read(req.params.id, (err, node) => {
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
      // Borrar el nodo si no tiene recetas
      db.delete(req.params.id, (err) => {
        if (err) return next(err);
        res.json(req.params.id);
      });
    });
  });
};

exports.create_instance = (req, res, next) => {
  const fecha = req.body.fechaCaducidad;
  const instance = {
    cantidad: parseFloat(req.body.cantidad),
    fechaCaducidad: fecha.substr(0,4) + '/' + fecha.substr(5,2) + '/' + fecha.substr(8,2)
  };
  MateriaPrima.push(req.params.id, 'instancias', instance, (err, inst) => {
    if (err) console.log(error);
    res.json(inst);
  });
};

exports.delete_instance = (req, res, next) => {
  db.delete(req.params.iid, true, (err) => {
    if (err) return next(err);
    res.json(req.params.iid);
  });
};*/
