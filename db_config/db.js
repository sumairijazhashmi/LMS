var mysql = require('mysql');

var connectionString = mysql.createConnection({
    host: "139.162.41.151",
    user: "dbcourse",
    password: "9yPpXjI5fhnDDCO",
    database: "LMS"
});
module.exports = connectionString;
connectionString.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
