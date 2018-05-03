var db = require('seraph')({ pass: 'Ariel' });
var MateriaPrima = require('../models/materiaprima');
var collections = require('../client/src/collections.js');

const collectionsIncludeValues = (unidad, categoria) => (
  collections.unidades.includes(unidad) && collections.categorias.map(x => x.label).includes(categoria)
);

exports.materiaprima_list = (req, res, next) => {
  db.nodesWithLabel('MateriaPrima', (err, nodes) => {
    if (err) return next(err);
    res.json(nodes);
  });
};

exports.materiaprima_category_list = (req, res, next) => {
  db.nodesWithLabel(req.params.cat, (err, nodes) => {
    if (err) return next(err);
    res.json(nodes);
  });
};

exports.materiaprima_create = (req, res, next) => {
  const categoria = req.body.categoria;
  if (!collectionsIncludeValues(req.body.unidad, categoria))
    return next();
  delete req.body.categoria;
  req.body.costo = parseFloat(req.body.costo);
  req.body.cantidad = parseFloat(req.body.cantidad);

  MateriaPrima.save(req.body, (err, node) => {
    if (err) return next(err);
    db.label(node, categoria, (err) => {
      if (err) return next(err);
    });
    res.json(node);
  });
};

exports.materiaprima_read = (req, res, next) => {
  MateriaPrima.read(req.params.id, (err, node) => {
    if (err || !node) return next(err);
    db.readLabels(node, (err, labels) => {
      node.categoria = labels.slice(-1)[0];
      res.json(node);
    });
  });
}

exports.materiaprima_update = (req, res, next) => {
  // Actualizar la categoria
  const categoria = req.body.categoria;
  const categoria_anterior = req.body.categoria_anterior;
  if (!collectionsIncludeValues(req.body.unidad, categoria))
    return next();
  delete req.body.categoria;
  delete req.body.categoria_anterior;

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
  });
};

exports.materiaprima_delete = (req, res, next) => {
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
    if (err) return next(error);
    res.json(inst);
  });
};

exports.delete_instance = (req, res, next) => {
  db.delete(req.params.iid, true, (err) => {
    if (err) return next(err);
    res.json(req.params.iid);
  });
};
