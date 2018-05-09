import React from 'react';

const Ingredients = (props) => (
  <div>
    {props.ingredients.length > 0 ? <h4>Ingredientes</h4> : <h4>No hay ingredientes</h4>}
    <ul>
      {props.ingredients.map(ingredient =>
        <li key={ingredient.id}>
          {ingredient.cantidad} {ingredient.unidad} de {ingredient.nombre.toLowerCase()} &emsp;
          {props.removeIngredient &&
            <button class="btn" onClick={() => props.removeIngredient(ingredient.id)}>Quitar</button>
          }
        </li>
      )}
    </ul>
  </div>
);

export default Ingredients;
