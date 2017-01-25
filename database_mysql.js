var mysql = require('mysql');
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dlsdus',
  database: 'o2'
});

con.connect();
/*
var sql = 'SELECT * FROM topic';
con.query(sql, function(err, rows, fields){
  if (err){
    console.log(err);
  }
  else {
    for(var i=0; i<rows.length; i++){
      console.log(rows[i].description);
    }
  }
});
*/

var sql = 'INSERT INTO topic (title, description, author) VALUES(?,?,?)';
var params = ['Supervisor', 'Watcher without restarting node', 'color.park'];
con.query(sql, params, function(err, rows, fields){
  if(err){
    console.log(err);
  } else {
    console.log(rows.insertId);
  }
});

con.end();
