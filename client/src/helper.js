export function formToJSON(form, stringify=true) {
  const formData = new FormData(form);
  var object = {};
  formData.forEach((value, key) => object[key] = value);
  if (!stringify) return object;
  return JSON.stringify(object);
}

export function compare(a, b) {
  const nombreA = a.nombre.toUpperCase();
  const nombreB = b.nombre.toUpperCase();
  if (nombreA < nombreB)
    return -1;
  if (nombreA > nombreB)
    return 1;
  return 0;
}

export function formatDate(date) {
  return date.substr(8,2) + '/' + date.substr(5,2) + '/' + date.substr(0,4);
}

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
