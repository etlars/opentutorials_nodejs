var express=require('express');
var session=require('express-session');
var bodyParser=require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'keyboard puppy',
  resave: false,
  saveUninitialized: true
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

// login
app.post('/auth/login', function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  // db에서 사용자 인증정보를 받아와서 대조해야하지만, 편의를 위해 코드로 밖음. ㅡ.ㅡ;;
  var user = {
    username:'color.park',
    password:'1234'
  };

  var output = '';

  if(user.username==username && user.password==password){
    res.redirect('/welcome');
  }
  else{
    res.send('Who R U ? <a href="/auth/login">login</a>');
  }

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
app.listen(3004, function(){
    console.log('Connected 3004 port');
});
