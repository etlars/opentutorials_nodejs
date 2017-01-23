var OrientDB = require('orientjs');

var server = OrientDB({
   host:       'localhost',
   port:       2424,
   username:   'root',
   password:   'dlsdus'
});

var db = server.use('color');

//SELECT * FROM topic --> @rid : unique id of orientdb
/*
db.record.get('#12:1').then(function(rec){
  console.log('Loaded record: ', rec);
});
*/
/*
 * CREATE
 * READ
 * UPDATE
 * DELETE
 */

// CREATE
/*
var sql = 'SELECT FROM topic';
db.query(sql).then(function(results){
  console.log(results);
});
*/
/*
var sql = 'SELECT FROM topic WHERE @rid=:rid';
var param = {
  params:{
    rid:'#12:1'
  }
};
db.query(sql, param).then(function(results){
  console.log(results);
});
*/
// INSERT
/*
var sql = 'INSERT INTO topic (title, description) VALUES(:title, :desc)';
var param = {
  params:{
    title:'Express',
    desc:'Express is framework for web'
  }
}
db.query(sql, param).then(function(results){
  console.log(results);
});
*/

//UPDATE
/*
var sql = 'UPDATE topic SET title=:title WHERE @rid=:rid';
db.query(sql, {params:{title:'Expressjs', rid:'#12:2'}}).then(function(results){
  console.log(results);
});
*/

//DELETE
var sql = 'DELETE FROM topic WHERE @rid=:rid';
db.query(sql, {params:{rid:'#12:2'}}).then(function(results){
  console.log(results);
});
