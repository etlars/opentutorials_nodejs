var mysql = require('mysql');
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dlsdus',
  database: 'o2'
});

con.connect();
var sql = 'SELECT * FROM topic';
con.query(sql, function(err, rows, fields){
  if (err){
    console.log(err);
  }
  else {
    console.log('rows:', rows);
    console.log('fields:', fields);
  }
});

con.end();
