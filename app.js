var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
app.use(bodyParser.json()); // for parsing application/json

app.use(express.static('./public'));

// Connection URL
var url = 'mongodb://localhost:27017/grupowy';

var findDocuments =  function(db, callback) {
	var collection = db.collection('Data');
  
	collection.find({},{sort: {time: -1}, limit: 200}).toArray(function(err, docs) {
    	assert.equal(err, null);
    	callback(docs);
  	});
}

app.get('/', function (req, res) {
	res.sendFile(path.resolve("__dirname + '/public/index.html"));
})

app.get('/get', function (req, res) {
	MongoClient.connect(url, function(err, db) {
    	assert.equal(null, err);
    	//console.log("Connected successfully to db");

	    findDocuments(db, function(docs) {
	       //console.log(docs);            
   		    res.end(JSON.stringify(docs));
			db.close();
    	});
  	});
})

app.get('/deleteAll', function (req, res) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected successfully to db");
    
		var collection = db.collection('Data');
	    collection.remove({}, {safe: true}, function(err, result) {
      		if(err) {
        		console.log(err);
				throw err;
      		}
      		console.log(result);
     	});
  	});

  res.end("Deleted all records");
})

app.post('/add', function (req, res) {
	MongoClient.connect(url, function(err, db) {
    	assert.equal(null, err);
    	console.log("Connected successfully to db");

	    var col = db.collection('Data');
    	col.insert(req.body, function(err, r) {
    	    assert.equal(null, err);
    		res.end('Added');
    		db.close();
    	});
  	});
})

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Server listening at http://%s:%s", host, port)
});
