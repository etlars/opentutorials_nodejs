var app = require('./config/mysql/express')(app);
var passport = require('./config/mysql/passport')(app);

var passport = require('./config/mysql/passport')(app);
var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/', auth);

var topic = require('./routes/mysql/topic')();
app.use('/topic', topic);

app.listen(3001, function(){
  console.log('Connected Port: 3001');
});
