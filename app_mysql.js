var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb: call-back function
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
    //cb(null, file.fieldname + '-' + Date.now())
  }
})
var upload = multer({ storage: storage})
var fs = require('fs');
var mysql = require('mysql');
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dlsdus',
  database: 'o2'
});

con.connect();
var app = express();  // appliation 객체 생성
app.use(bodyParser.urlencoded({ extended: false }));
app.locals.pretty = true;
app.use('/user', express.static('uploads'));
app.set('views', './views_mysql');
app.set('view engine', 'jade');

app.get('/upload', function(req, res){
  res.render('upload');
});
app.post('/upload', upload.single('userfile'), function(req, res){
  console.log(req.file);
  res.send('Uploaded : '+req.file.originalname);
});

app.get('/topic/add', function(req, res){
  var sql = 'SELECT id, title FROM topic';
  con.query(sql, function(err, topics, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('add', {topics:topics});
  });
});

app.post('/topic/add', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;

  var sql = 'INSERT INTO topic (title, description, author) VALUES(?,?,?)';
  con.query(sql, [title, description, author], function(err, result, fields){
    if(err){
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
    //res.send('Success!');
    res.redirect('/topic/'+result.insertId)
  });
});


app.get(['/topic', '/topic/:id'], function(req, res){
    var sql = 'SELECT id, title FROM topic';
    con.query(sql, function(err, topics, fields){
      //res.send(rows);
      var id = req.params.id;
      if(id){
        var sql = 'SELECT * FROM topic WHERE id=?';
        con.query(sql, [id], function(err, topic, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else{
            res.render('view', {topics:topics, topic:topic[0]});
          }
        })
      }
      else{
        res.render('view', {topics:topics});
      }
    });
});

app.listen(3001, function(){
  console.log('Connected Port: 3001');
});
