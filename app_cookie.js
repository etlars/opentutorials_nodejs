var express=require('express');
var cookieParser = require('cookie-parser')
var app = express();
//app.use(cookieParser());
app.use(cookieParser('asdibch35402c3bh q13re##111'));

// ROUTERS
app.get('/count', function(req, res){
  var count = 0;

  //if(req.cookies.count)
  if(req.signedCookies.count)
    //count = parseInt(req.cookies.count);
    count = parseInt(req.signedCookies.count);

  count = count + 1;
  //res.cookie('count', count);
  res.cookie('count', count, {signed:true});
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
  var cart = req.signedCookies.cart;
  if(!cart){
    res.send('Empty!');
  }else{
    var output = '';
    for(var id in cart){
      output += `
        <li>
        ${products[id].title} (${cart[id]} ea.)
        </li>
      `;
    }
    res.send(`
      <h2>Cart</h2>
      <ul>${output}</ul>
      <a href="/products">Product List</a>`);
  }
  //res.send('Hi~ Cart');
});
app.get('/cart/:id', function(req, res){
  var id = req.params.id;
  var cart = {};
  if(req.signedCookies.cart)
    cart = req.signedCookies.cart;

  if(!cart[id])
    cart[id]=0;

  cart[id] = parseInt(cart[id])+1;
  res.cookie('cart', cart, {signed:true});

  res.redirect('/cart');
  //res.send(cart);
});


// LISTEN PORT
app.listen(3003, function(){
    console.log('Connected 3003 port');
});
