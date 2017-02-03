
module.exports = function(app){

  var con = require('./db')();
  var bkfd2Password = require("pbkdf2-password");
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var hasher = bkfd2Password();

  app.use(passport.initialize());
  app.use(passport.session());


  // login for passport
  passport.serializeUser(function(user, done) { // 최초 로긴할때 한번만 실행됨
    console.log('serializeUser', user);
    done(null, user.authId);
  });

  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    var sql = 'SELECT * FROM users WHERE authId=?';
    con.query(sql, [id], function(err, results){
      console.log(sql, err, results);
      if(err){
        console.log(err);
        done('There is no user.');
      } else {
        done(null, results[0]);
      }
    });
  });

  passport.use(new LocalStrategy(   // middleware callback -- local
    function(username, password, done){
      var uname = username;
      var pwd = password;

      var sql = 'SELECT * FROM users WHERE authId=?';
      con.query(sql, ['local:'+uname], function(err, results){
        //console.log(results);
        if(err){
          return done('There is no user.');
        }

        var user = results[0];
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            done(null, user); // --> passport.serializeUser
          }else{
            done(null, false);  // --> passport.serializeUser 로 접근한 사용자가 다음에 로그인할 때
          }
        });
      });
    }
  ));

  return passport;
}
