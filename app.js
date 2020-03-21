var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var db = null
/*MongoClient.connect('mongodb://root00:root00@ds215338.mlab.com:15338/heroku_1rb0rch9', function(err,database) {
    db = database.db('heroku_1rb0rch9');
});*/
MongoClient.connect('mongodb+srv://admin:admin@cluster0-5vple.mongodb.net/test?retryWrites=true&w=majority', function(err,database) {
    db = database.db('microcosmos-db');
});

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Vous êtes à l\'accueil');
});


/******JOB******/

app.post('/job/insert', (req, res) => {
	db.collection('job').insertOne(req.body);
	res.send();
});

app.delete('/job/delete/:id', (req, res) => {
	var id = req.params.id;
	db.collection('job').deleteOne({id : id});
	res.send();
});

app.put('/job/update/:id', (req, res) => {
	var id = req.params.id;
	db.collection('job').update({id : id}, req.body);
	res.send();
});

app.get('/job/get/:id', (req, res) => {
	var id = req.params.id;
    db.collection('job').find({ id : id }).toArray(function(err, results) {
		res.send(results);
	});
});

app.get('/job/get', (req, res) => {
    db.collection('job').find().toArray(function(err, results) {
		res.send(results);
	});
});

app.get('/job/get/state/:state/search/:search', (req, res) => {
	var state = req.params.state;
	var search = req.params.search;
    db.collection('job').find({ state : state, name : new RegExp(search) }).toArray(function(err, results) {
		res.send(results);
	});
});

app.get('/job/get/owner/:owner/state/:state/search/:search', (req, res) => {
	var owner = req.params.owner;
	var state = req.params.state;
	var search = req.params.search;
    db.collection('job').find({ owner : owner, state : state, name : new RegExp(search) }).toArray(function(err, results) {
		res.send(results);
	});
});

app.get('/job/isowner/login/:login/jobid/:jobid', (req, res) => {
	var login = req.params.login;
	var jobid = req.params.jobid;

    db.collection('job').find({ owner : login, id : jobid }).toArray(function(err, results) {
		if(results.length > 0)
			res.send(true);
		else
			res.send(false);
	});
});


/******USER******/

app.post('/user/insert', (req, res) => {
	db.collection('user').insertOne(req.body);
	res.send();
});

app.delete('/user/delete/:id', (req, res) => {
	var id = req.params.id;
	db.collection('user').deleteOne({id : id});
	res.send();
});

app.put('/user/update/:id', (req, res) => {
	var id = req.params.id;
	db.collection('user').update({id : id}, req.body);
	res.send();
});

app.get('/user/get/:id', (req, res) => {
	var id = req.params.id;
    db.collection('user').find({ id : id }).toArray(function(err, results) {
		res.send(results);
	});
});

app.post('/user/connect', (req, res) => {
	var _login = req.body.login;
	var _password = req.body.password;

    db.collection('user').find({login : _login, password : _password}).toArray(
    	function(err, results) {
			if(results.length > 0)
				res.send({"connected" : true});
			else
				res.send({"connected" : false});
		});
});


app.listen(process.env.PORT || 3000);