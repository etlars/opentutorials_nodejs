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
  fs.readdir('Data', function(error, files){
    if(error){
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
    res.render('new', {topics:files});
  });


})

app.get(['/topic', '/topic/:id'], function(req, res){
    fs.readdir('Data', function(error, files){
      if(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
      }

      var id = req.params.id;

      if(id){
        fs.readFile('Data/'+id, 'utf8', function(error, data){
          if(error){
              console.log(error);
              res.status(500).send('Internal Server Error');
          }
          //res.send(data);
          res.render('view', {topics:files, title:id, description:data});
        });
      } else {
        res.render('view', {topics:files, title:'Welcome', description: 'Hello JvaScript for Server'});
      }
    });
})

/*
app.get('/topic/:id', function(req, res){
    var id=req.params.id;

    fs.readdir('Data', function(error, files){
      if(error){
        console.log(error);
        res.status(500).send('Internal Server Error');
      }
      fs.readFile('Data/'+id, 'utf8', function(error, data){
        if(error){
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
        //res.send(data);
        res.render('view', {topics:files, title:id, description:data});
      })
    })
})
*/

app.post('/topic', function(req, res){
  //res.send("Hi Post");
  //res.send('Hi Post'+req.body.title);
  var title = req.body.title;
  var description = req.body.description;

  fs.writeFile('Data/'+title, description, function(error){
    if(error){
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
    //res.send('Success!');
    res.redirect('/topic/'+title)
  })
})
