module.exports = function(passport){

  var bkfd2Password = require("pbkdf2-password");
  var route = require('express').Router();
  var hasher = bkfd2Password();
  var con = require('./../../config/mysql/db')();

  route.post('/login',
    passport.authenticate( // middleware
     'local',
     {
         successRedirect: '/topic',
         failureRedirect: '/auth/login',
         failureFlash: false
       }
    )
  );

  route.post('/register', function(req, res){

    hasher({password:req.body.password}, function(err, pass, salt, hash){
      var user = {
        authId:'local:'+req.body.username,
        username:req.body.username,
        password:hash,
        salt:salt,
        displayName:req.body.displayName
      };

      var sql = 'INSERT INTO users SET ?';
      con.query(sql, user, function(err, result){
        if(err){
          console.log(err);
          res.status(500);
        }else {
          //res.send(users); // 디버깅용 브라우저에 출력하기
          req.login(user, function(err){  // passportjs method
            req.session.save(function(){
              res.redirect('/topic');
            });
          });
        }
      });
    });
  });

  route.get('/register', function(req, res){
    var sql = 'SELECT id, title FROM topic';
    con.query(sql, function(err, topics, fields){
      res.render('auth/register', {topics:topics});
    });
  });

  route.get('/login', function(req, res){
    var sql = 'SELECT id, title FROM topic';
    con.query(sql, function(err, topics, fields){
      res.render('auth/login', {topics:topics});
    });
  });

  // Logout
  route.get('/logout', function(req, res){
    //delete req.session.displayName;
    req.logout(); // passportjs 에서 제공하는 method
    req.session.save(function(){
      res.redirect('/topic');
    });
    //res.send('Bye~ Logout successfully');
  });

  return route;
}
