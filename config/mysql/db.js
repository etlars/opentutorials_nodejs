

module.exports = function(){

  var mysql = require('mysql');
  var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dlsdus',
    database: 'o2'
  });

  con.connect();

  return con;
}
