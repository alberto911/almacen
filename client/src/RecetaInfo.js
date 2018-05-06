import React from 'react';
import Ingredients from './Ingredients';
import { round } from './helper.js';

const RecetaInfo = ({ product }) => (
  <div>
    <p>Rinde {product.cantidad} {product.unidad}</p>
    <p>Caduca {product.diasCaducidad} días después de preparar</p>
    <p>Costo: ${round(product.costo, 2)}</p>

    <Ingredients ingredients={product.ingredientes} />
  </div>
);

export default RecetaInfo;
