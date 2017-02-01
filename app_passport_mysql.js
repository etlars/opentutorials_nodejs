var express=require('express');
var session=require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser=require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var mysql = require('mysql');
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dlsdus',
  database: 'o2'
});

con.connect();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'keyboard puppy',
  resave: false,
  saveUninitialized: true,
  store:new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'dlsdus',
    database: 'o2'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

// ROUTERS
app.get('/count', function(req, res){
  if(req.session.count){
    req.session.count++;
  }else{
    req.session.count=1;
  }
  res.send('count: '+req.session.count);
});

app.get('/temp', function(req, res){
  res.send('result: '+count);
});

// Logout
app.get('/auth/logout', function(req, res){
  //delete req.session.displayName;
  req.logout(); // passportjs 에서 제공하는 method
  req.session.save(function(){
    res.redirect('/welcome');
  });
  //res.send('Bye~ Logout successfully');
});

app.get('/welcome', function(req, res){
  if(req.user && req.user.displayName){
    res.send(`
      <h2> Hello, ${req.user.displayName}</h2>
      <a href="/auth/logout">Logout</a>
      `);
  } else {
    res.send(`
      <h2> Welcome </h2>
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
      `);
  }
  //res.send(req.session)
});

// login for passport
passport.serializeUser(function(user, done) { // 최초 로긴할때 한번만 실행됨
  console.log('serializeUser', user);
  done(null, user.authId);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  for(var i=0; i<users.length; i++){
    var user = users[i];
    if(user.authId == id){
      return done(null, user);
    }
  }
  return done(null, false);
});

passport.use(new LocalStrategy(   // middleware callback -- local
  function(username, password, done){
    var uname = username;
    var pwd = password;

    for( var i=0; i<users.length; i++){
      var user = users[i];

      if(uname == user.username){
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            done(null, user); // --> passport.serializeUser
          }else{
            done(null, false);  // --> passport.serializeUser 로 접근한 사용자가 다음에 로그인할 때
          }
        });
      }
    }
    done(null, false);
  }
));

app.post('/auth/login',
  passport.authenticate( // middleware
   'local',
   {
       successRedirect: '/welcome',
       failureRedirect: '/auth/login',
       failureFlash: false
     }
  )
);

var users = [
  {
    authId:'local:color.park',
    username:'color.park',
    password: 'DOdcxcbj0sM8zCF5S/Agw1h8T9i/2eoA5y82fQr2zakUtaMJXB7GYuI0/0o5FXD45PsBc9wwdf/9knTqWOyFVOQJfeBqYiwCriZhQIlKTbA4jH8Oe9Wo7b7IogyH5l0mK7BoSQDUDEiZdp4kkIu1o1FE9TW666PRoAzz0ti6jEQ=', // pbkdf2-password(pwd+salt)
    salt: 'pIVX4DLJRU9OcQYDuMg/Otr1+L+csmbqBb7ziW27RKiwDmhVoKLF8Wwp5pcm2WoQhtmESfIpdrXiyQMaNeUv5w==',
    displayName:'Joseph'
  }
];

app.post('/auth/register', function(req, res){

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
        res.redirect('/welcome');
      }
    });
    //users.push(user); // 전역변수 users에 추가하기
    //res.send(users); // 디버깅용 브라우저에 출력하기
    // req.login(user, function(err){  // passportjs method
    //   req.session.save(function(){
    //     res.redirect('/welcome');
    //   });
    // });
  });
});

app.get('/auth/register', function(req, res){
  var output = `
  <h2>Register</h2>
  <form action="/auth/register" method="post">
    <p>
        <input type='text' name='username' placeholder='username'>
    </p><p>
        <input type='password' name='password' placeholder='passsword'>
    </p><p>
        <input type='text' name='displayName' placeholder='displayName'>
    </p>
    <input type='submit'>
  </form>
  `;
  res.send(output);
});

app.get('/auth/login', function(req, res){
  var output = `
    <h2> Login </h2>
    <form action="/auth/login" method=post>
      <p>
          <input type='text' name='username' placeholder='username'>
      </p><p>
          <input type='password' name='password' placeholder='passsword'>
      </p><p>
        <input type='submit'>
    </form>
  `;

  res.send(output);
  //res.send('Hello login');
});

// LISTEN
app.listen(3006, function(){
    console.log('Connected 3006 port');
});
