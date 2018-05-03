import React from 'react';
var collections = require('./collections')

const UnitSelect = () => (
  <select required name="unidad" defaultValue="">
    <option value="" disabled>Unidad</option>
    {collections.unidades.map(unidad =>
      <option key={unidad} value={unidad}>{unidad}</option>
    )}
  </select>
);

export default UnitSelect;
