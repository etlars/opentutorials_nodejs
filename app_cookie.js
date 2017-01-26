var express=require('express');
var cookieParser = require('cookie-parser')
var app = express();
app.use(cookieParser());

// ROUTERS
app.get('/count', function(req, res){
  var count = 0;

  if(req.cookies.count)
    count = parseInt(req.cookies.count);

  count = count + 1;
  res.cookie('count', count);
  res.send('count : '+ count);
})

var products = {
  1:{title:'The history of WEB 1'},
  2:{title:'The next WEB'},
  3:{title:'JavaScript for Server'},
}
app.get('/products', function(req, res){
  var output = '';

  for(var product in products){
    output += `
      <li>
        <a href="/cart/${product}">${products[product].title}</a>
      </li>`;
    console.log(products[product].title);
  }
  res.send(`
    <h2>Products</h2>
    <ul>${output}</ul>
    <h3><a href="/cart">Cart</a></h3>
    `);
  //res.send('Products');
});

app.get('/cart', function(req, res){
  res.send('Cart');
});


// LISTEN PORT
app.listen(3003, function(){
    console.log('Connected 3003 port');
});
