import React from 'react';
import Ingredients from './Ingredients';

const RecetaInfo = ({ receta }) => (
  <div>
    <p>Rinde {receta.cantidad} {receta.unidad}</p>
    <p>Caduca {receta.diasCaducidad} días después de preparar</p>
    <p>Costo: (pendiente)</p>

    <Ingredients ingredients={receta.ingredientes} />
  </div>
);

export default RecetaInfo;
