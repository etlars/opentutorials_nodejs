var express=require('express');
var session=require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser=require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'keyboard puppy',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}));

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
  delete req.session.displayName;

  res.redirect('/welcome');
  //res.send('Bye~ Logout successfully');
})

app.get('/welcome', function(req, res){
  if(req.session.displayName){
    res.send(`
      <h2> Hello, ${req.session.displayName}</h2>
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
//var salt = 'dsfg;j3$^@209234ujl!SFaslfjl1&*&*31!';
var users = [
  {
    username:'color.park',
    password: 'DOdcxcbj0sM8zCF5S/Agw1h8T9i/2eoA5y82fQr2zakUtaMJXB7GYuI0/0o5FXD45PsBc9wwdf/9knTqWOyFVOQJfeBqYiwCriZhQIlKTbA4jH8Oe9Wo7b7IogyH5l0mK7BoSQDUDEiZdp4kkIu1o1FE9TW666PRoAzz0ti6jEQ=', // pbkdf2-password(pwd+salt)
    salt: 'pIVX4DLJRU9OcQYDuMg/Otr1+L+csmbqBb7ziW27RKiwDmhVoKLF8Wwp5pcm2WoQhtmESfIpdrXiyQMaNeUv5w==',
    displayName:'Joseph'
  }
];

app.post('/auth/register', function(req, res){

  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
      username:req.body.username,
      password:hash,
      salt:salt,
      displayName:req.body.displayName
    };

    users.push(user); // 전역변수 users에 추가하기
    //res.send(users); // 디버깅용 브라우저에 출력하기
    req.session.displayName = req.body.displayName;
    req.session.save(function(){
      res.redirect('/welcome');
    });
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


// login
app.post('/auth/login', function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  for( var i=0; i<users.length; i++){
    var user = users[i];

    if(username == user.username){
      return hasher({password:password, salt:user.salt}, function(err, pass, salt, hash){
        if(hash === user.password){
          req.session.displayName = user.displayName;
          req.session.save(function(){
            res.redirect('/welcome');
          })
        }else{
          res.send('Who R U ? <a href="/auth/login">login</a>');
        }
      });
    }
  }
  res.send('Who R U ? <a href="/auth/login">login</a>');
  //res.send('username: '+req.body.username+', password : '+req.body.password);
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
app.listen(3005, function(){
    console.log('Connected 3005 port');
});
