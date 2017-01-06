var express = require('express');
var app = express();  // appliation 객체 생성

var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(3000, function(){
  console.log('Connected Port: 3000');
})

app.locals.pretty = true;
app.set('views', './views_file');
app.set('view engine', 'jade');
app.get('/topic/new', function(req, res){
  res.render('new');
})

app.post('/topic', function(req, res){
  //res.send("Hi Post");
  //res.send('Hi Post'+req.body.title);
  var title = req.body.title;
  var description = req.body.description;

  fs.writeFile('data/'+title, description, function(error){
    if(error){
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
    res.send('Success!');
  })




})