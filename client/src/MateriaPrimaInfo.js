import React from 'react';
var collections = require('./collections.js')

const MateriaPrimaInfo = ({ product }) => {
  if (product.categoria)
    var cat = collections.categorias.find(x => x.label === product.categoria);
  return (
    <div>
      {product.categoria && cat &&
        <p>Categoría: {cat.nombre}</p>
      }
      <p>Costo: ${product.costo} por {product.cantidad} {product.unidad}</p>
    </div>
  );
};

export default MateriaPrimaInfo;
