module.exports = function(passport){

  var bkfd2Password = require("pbkdf2-password");
  var route = require('express').Router();
  var hasher = bkfd2Password();
  var con = require('./../../config/mysql/db')();

  route.post('/login',
    passport.authenticate( // middleware
     'local',
     {
         successRedirect: '/welcome',
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
              res.redirect('/welcome');
            });
          });
        }
      });
    });
  });

  route.get('/register', function(req, res){
    res.render('auth/register');
  });

  route.get('/login', function(req, res){
    res.render('auth/login');
  });

  // Logout
  route.get('/logout', function(req, res){
    //delete req.session.displayName;
    req.logout(); // passportjs 에서 제공하는 method
    req.session.save(function(){
      res.redirect('/welcome');
    });
    //res.send('Bye~ Logout successfully');
  });

  return route;
}
