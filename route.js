var express = require('express');
var app = express();
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');

app.use(express.static('public'));
app.get('/', function(req, res){
		res.send("Hello Express");
	}
);

app.get('/form', function(req, res){
		res.render('form');
});

app.get('/template', function(req, res){
	//res.render('temp', {time:'hello'});
	res.render('temp', {time:Date(), _title:'Jade'});
});

app.get('/login', function(req, res){
		res.send("<h2>Please Login</h2>");
		}
);

app.get('/girl', function(req, res){
		res.send('hello router, <img src="/girl.png">');
		});

app.get('/dynamic', function(req, res){
		var lis = '';
		for(var i=0; i<5; i++){
			lis += '<li>coding</li>';
		}
		var time = Date();

		var output =`
		<html>
		  <body>
		      hello Dynamic<br>
			  <ul>
			  ${lis}
				</ul>
				${time}
			    </body>
				</html>
		`;
		res.send(output);
});

app.get('/topic', function(req, res){
/**/
		var topics= [
			'JavaScript is ...',
			'NodeJS is ...',
			'Express is ...'
		];
		var str = `
			<a href="/topic?id=0">JavaScript</a><br>
			<a href="/topic?id=1">NodeJS</a><br>
			<a href="/topic?id=2">Express</a><br>
			${topics[req.query.id]}
		`;

		//var output = str + topics[req.query.id];
/**/
//		var output = req.query.id + ', ' + req.query.name;
		res.send(str);
});

app.get('/semantic/:id', function(req, res){
	var topics= [
		'JavaScript is ...',
		'NodeJS is ...',
		'Express is ...'
	];
	var output = `
		${topics[req.params.id]}
	`;

	res.send(output);
})

app.get('/semantic/:id/:mode', function(req, res){
/*
	var topics= [
		'JavaScript is ...',
		'NodeJS is ...',
		'Express is ...'
	];
	var output = `
		${topics[req.params.id]}
	`;
*/
	res.send(req.params.id+','+req.params.mode);
})

app.listen(3000, function() {
	console.log('Example app listen on port 3000!');
});
