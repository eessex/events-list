var express = require('express');
var path = require('path')
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var httpProxy = require('http-proxy');
require('dotenv').load();

var db;

var proxy = httpProxy.createProxyServer();
var app = express()

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));
app.use(bodyParser.json());

// run server
MongoClient.connect(process.env.MONGODB_URI, function(err, dbConnection) {
  db = dbConnection;
  var server = app.listen(port, function() {
    console.log('Started server at port', port);
  });
});

// Bundle Dev
if (!isProduction) {
  console.log('in bundle, not production')
  var bundle = require('./server/bundle.js');
  bundle();
  // Any requests to localhost:3000/build is proxied
  // to webpack-dev-server
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://localhost:8081'
    });
  });
}
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

// API
app.get('/api/events', function(req, res) {
  console.log("Query string", req.query);
  var filter = {};
  if (req.query.priority)
    filter.priority = req.query.priority;
  if (req.query.published)
    filter.published = req.query.published;

   db.collection('events').find(filter).toArray(function(err, docs) {
    res.json(docs);
  });
});

app.post('/api/events/', function(req, res) {
  console.log("New event:", req.body);
  var newEvent = req.body;
  db.collection("events").insertOne(newEvent, function(err, result) {
    var id = result.insertedId;
    db.collection("events").find({_id: id}).next(function(err, doc) {
      res.json(doc);
    });
  });
});

app.patch('/api/events/:id', function (req, res) {
  console.log("Update Event:", req.body);
  var updateEvent = req.body;
  var id = req.params.id;
  db.collection("events").update({_id: ObjectId(id)}, {$set: updateEvent}, function(err, result) {
    db.collection("events").find({_id: ObjectId(id)}).next(function(err, doc) {
      console.log('successfully saved')
      res.send(doc);
    });
  });
});

app.get('/api/events/:id', function(req, res) {
  db.collection("events").findOne({_id: ObjectId(req.params.id)}, function(err, event) {
    res.json(event);
  });
});

app.delete('/api/events/:id', function(req, res) {
  console.log("Deleting event:", req.params.id);
  var id = ObjectId(req.params.id);
  db.collection("events").deleteOne({_id: id});
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/public', 'index.html'))
 })