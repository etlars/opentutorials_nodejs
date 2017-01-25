var mysql = require('mysql');
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dlsdus',
  database: 'o2'
});

con.connect();

var sql = 'DELETE FROM topic WHERE id=?';
var params = 4;
con.query(sql, params, function(err, rows, fields){
  if(err){
    console.log(err);
  } else {
    console.log(rows);
  }
});

con.end();
