var express = require('express');
var app = express();  // appliation 객체 생성

var OrientDB = require('orientjs');

var server = OrientDB({
   host:       'localhost',
   port:       2424,
   username:   'root',
   password:   'dlsdus'
});
var db = server.use('color');


var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

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
//var upload = multer({ dest: 'uploads/' })
var upload = multer({ storage: storage})


app.use('/user', express.static('uploads'));


app.listen(3000, function(){
  console.log('Connected Port: 3000');
})

app.locals.pretty = true;

app.get('/upload', function(req, res){
  res.render('upload');
})
app.post('/upload', upload.single('userfile'), function(req, res){
  console.log(req.file);
  res.send('Uploaded : '+req.file.originalname);
})

app.set('views', './views_orientdb');
app.set('view engine', 'jade');
app.get('/topic/add', function(req, res){
  var sql = 'SELECT FROM topic';
  db.query(sql).then(function(topics){
    if(topics.length == 0){
      console.log('There is no record');
      res.status(500).send('Internal Server Error');
    }
    res.render('add', {topics:topics});
  });
});

app.post('/topic/add', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;

  var sql = 'INSERT INTO topic (title, description, author) VALUES(:title, :desc, :author)';
  db.query(sql, {
    params:{
      title:title,
      desc:description,
      author:author
    }
  }).then(function(results){
    //res.send(results);
    //res.redirect('/topic/'+results[0]['@rid']);
    res.redirect('/topic/'+encodeURIComponent(results[0]['@rid']));
  });
})

app.get(['/topic', '/topic/:id'], function(req, res){
  var sql = 'SELECT FROM topic';
  db.query(sql).then(function(topics){
    //res.send(results);
    var id = req.params.id;
    if(id){
      var sql = 'SELECT FROM topic WHERE @rid=:rid';
      db.query(sql, {params:{rid:id}}).then(function(topic){
        res.render('view', {topics:topics, topic:topic[0]});
      });
    }
    else {
      res.render('view', {topics:topics});
    }
  })
})
