import React from 'react';
var collections = require('./collections')

const CategorySelect = (props) => (
  <div class="selecciona">
    <label htmlFor="categoria">Categoría: </label>
    <select required name="categoria" id="categoria" defaultValue="" onChange={props.onChange}>
      <option value="" disabled={!props.filter}>
        {props.filter ? "Todas" : "Selecciona"}
      </option>
      {collections.categorias.map(cat =>
        <option key={cat.label} value={cat.label}>{cat.nombre}</option>
      )}
    </select><br />
  </div>
);

export default CategorySelect;
