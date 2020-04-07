const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const bodyParser = require('body-parser');
const request = require('request');
const multer = require('multer');

multer({dest : './user/image/'});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './user/image/')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.owner)
  }
});

const upload = multer({storage : storage});


var app = express();
app.use(bodyParser.json());

var db = null
MongoClient.connect('mongodb://root00:root00@ds215338.mlab.com:15338/heroku_1rb0rch9', function(err,database) {
    db = database.db('heroku_1rb0rch9');
});
/*MongoClient.connect('mongodb+srv://admin:admin@cluster0-5vple.mongodb.net/test?retryWrites=true&w=majority', function(err,database) {
    db = database.db('microcosmos-db');
});*/

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Bienvenue sur MICROCOSMOS');
});


/******OFFER******/

app.post('/offer/insert', (req, res) => {
	req.body.state = 'WAITING'
	req.body.date = new Date().toISOString()
	db.collection('offer').insertOne(req.body);
	res.send({"success" : true});
});

/******JOB******/

app.post('/job/insert', (req, res) => {
	req.body.state = 'TODO'
	req.body.date = new Date().toISOString()
	db.collection('user').findOne({mail : req.body.owner}, function(err, result){
		req.body.ownerFirstname = result.firstname
		req.body.ownerMail = result.mail
		db.collection('job').insertOne(req.body);
		res.send({"success" : true});
	})
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

app.get('/job/get', (req, res) => {
    db.collection('job').find().toArray(function(err, results) {
		res.send(results);
	});
});

app.get('/job/get/:id', (req, res) => {
	var id = req.params.id;
    db.collection('job').findOne({ _id : ObjectId(id) }, function(err, results) {
		res.send(results);
	});
});

app.get('/job/get/state/:state/search/:search?', (req, res) => {
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
	res.send({"success" : true});
});

app.delete('/user/delete/:id', (req, res) => {
	var id = req.params.id;
	db.collection('user').deleteOne({id : id});
	res.send();
});

app.put('/user/update/:id', (req, res) => {
	var id = req.params.id;
	db.collection('user').updateOne({id : id}, req.body);
	res.send();
});

app.get('/user/get/:id', (req, res) => {
	var id = req.params.id;
    db.collection('user').find({ id : id }).toArray(function(err, results) {
		res.send(results);
	});
});

app.post('/user/exist', (req, res) => {
	var _mail = req.body.mail;
	var _password = req.body.password;

    db.collection('user').find({mail : _mail, password : _password}).toArray(
    	function(err, results) {
			if(results.length > 0)
				res.send({"success" : true});
			else
				res.send({"success" : false});
		});
});

app.post('/user/image', upload.single('image'), function (req, res, next) {
	var s = req.file
	console.log(s)
  res.send({success : true});
});

app.get('/user/image/:owner', (req, res) => {
  const file = './user/image/'+req.params.owner;
  res.download(file);
});

app.listen(process.env.PORT || 3000);