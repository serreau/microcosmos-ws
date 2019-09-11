var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var app = express();

var db = null
MongoClient.connect('mongodb://root00:root00@ds215338.mlab.com:15338/heroku_1rb0rch9', function(err,database) {
    db = database.db('heroku_1rb0rch9');
});

app.get('/', function(req, res) {
	console.log("/");
    res.setHeader('Content-Type', 'text/plain');
    res.send('Vous êtes à l\'accueil');
});

app.get('/get', (req, res) => {
	console.log("GET");
    db.collection('job').find().toArray(function(err, results) {
		res.send(results);
	});
});

app.listen(process.env.PORT || 3000);