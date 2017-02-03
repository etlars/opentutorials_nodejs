
var app = require('./config/mysql/express')(app);
var passport = require('./config/mysql/passport')(app);

// ROUTERS

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

var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/', auth);

// LISTEN
app.listen(3007, function(){
    console.log('Connected 3007 port');
});
