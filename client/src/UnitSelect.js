import React from 'react';
var collections = require('./collections')

const UnitSelect = () => (
    <div>
<label htmlFor="unidad">Selecciona el tipo de unidad: </label>
  <select required name="unidad" defaultValue="">
    <option value="" disabled>Unidad</option>
    {collections.unidades.map(unidad =>
      <option key={unidad} value={unidad}>{unidad}</option>
    )}
  </select>
</div>
);

export default UnitSelect;
