if (process.env.GRAPHENEDB_URL) {
  var url = require('url').parse(process.env.GRAPHENEDB_URL)

  var db = require("seraph")({
    server: url.protocol + '//' + url.host,
    user: url.auth.split(':')[0],
    pass: url.auth.split(':')[1]
  });
}
else
  var db = require('seraph')({ pass: 'Ariel' });

module.exports = db;
