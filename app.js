var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var db = null
MongoClient.connect('mongodb://root00:root00@ds215338.mlab.com:15338/heroku_1rb0rch9', function(err,database) {
    db = database.db('heroku_1rb0rch9');
});

/******JOB******/

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Vous êtes à l\'accueil');
});

app.post('/job/insert', (req, res) => {
	db.collection('job').insert(req.body);
	res.send();
});

app.delete('/job/delete/:id', (req, res) => {
	db.collection('job').deleteOne({id : req.params.id});
	res.send();
});

app.put('/job/update/:id', (req, res) => {
	db.collection('job').update({id : req.params.id}, req.body);
	res.send();
});

app.get('/job/get/:id', (req, res) => {
    db.collection('job').find({ id: req.params.id }).toArray(function(err, results) {
		res.send(results);
	});
});

app.get('/job/get', (req, res) => {
    db.collection('job').find().toArray(function(err, results) {
		res.send(results);
	});
});

app.get('/job/get/state/:state/search/:search', (req, res) => {
    db.collection('job').find({ state : req.params.state, name : req.params.search }).toArray(function(err, results) {
		res.send(results);
	});
});

app.listen(process.env.PORT || 3000);