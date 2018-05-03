import React from 'react';
var collections = require('./collections.js')

const MateriaPrimaInfo = ({ product }) => (
  <div>
    {product.categoria &&
      <p>Categoría: {collections.categorias.find(x => x.label === product.categoria).nombre}</p>
    }
    <p>Costo: ${product.costo} por {product.cantidad} {product.unidad}</p>
  </div>
);

export default MateriaPrimaInfo;
