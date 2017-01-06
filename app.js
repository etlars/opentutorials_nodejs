var express = require('express');
var app = express();

app.get('/', function(req, res){
		res.send("Hello Express");
	}
);

app.get('/login', function(req, res){
		res.send("<h1>Please Login</h1>");
		}
);



app.listen(3000, function() {
	console.log('Example app listen on port 3000!');
});
