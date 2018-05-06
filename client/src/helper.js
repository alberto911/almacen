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
  if (date.length === 10)
    return date.substr(8,2) + '/' + date.substr(5,2) + '/' + date.substr(0,4);
  else {
    var s = new Date(date).toLocaleDateString().split('/');
    for (let i = 0; i < 2; ++i)
      if (s[i].length === 1)
        s[i] = '0' + s[i];
    return s.join('/');
  }
}

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function round(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
