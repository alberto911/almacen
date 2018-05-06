var collections = require('../client/src/collections.js');

exports.collectionsIncludeValues = (unidad, categoria) => {
  const unitExists = collections.unidades.includes(unidad);
  if (!categoria)
    return unitExists;
  return unitExists && collections.categorias.map(x => x.label).includes(categoria);
};

exports.todayPlusDays = (days) => {
  var result = new Date();
  result.setDate(result.getDate() + days);
  return result.getTime();
};
