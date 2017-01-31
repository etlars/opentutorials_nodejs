var express=require('express');
var session=require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser=require('body-parser');
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

var users = [{
  username:'color.park',
  password:'1234',
  displayName:'Jospeph'
}];

app.post('/auth/register', function(req, res){
  var user = {
    username:req.body.username,
    password:req.body.password,
    displayName:req.body.displayName
  };
  users.push(user); // 전역변수 users에 추가하기
  //res.send(users); // 디버깅용 브라우저에 출력하기
  req.session.displayName = req.body.displayName;
  req.session.save(function(){
    res.redirect('/welcome');
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
    if(user.username==username && user.password==password){
      req.session.displayName = user.displayName;
      return req.session.save(function(){
        res.redirect('/welcome');  // save가 완료되면 return
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
