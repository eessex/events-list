var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const path = require('path')
const app = express()

var db;

app.use(express.static('static'));

app.use(express.static(path.join(__dirname,"/static")));

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

app.use(bodyParser.json());

app.post('/api/events/', function(req, res) {
  console.log("New event:", req.body);
  var newEvent = req.body;
  db.collection("events").insertOne(newEvent, function(err, result) {
    var newId = result.insertedId;
    db.collection("events").find({_id: newId}).next(function(err, doc) {
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

// app.patch('/api/events/:id', function(req, res) {
//   console.log("Req body for patch:", req.body);
//   var updateEvent = req.body;
//   var id = req.params.id;
//   db.collection("events").update({
//     _id  : ObjectId(id)
//   }, {$set: updateEvent}).next(function(err, doc) {
//       res.json(doc);
//     });
//   // db.collection("events").insertOne(newEvent, function(err, result) {
//   //   var newId = result.insertedId;
//   //   db.collection("events").find({_id: newId}).next(function(err, doc) {
//   //     res.json(doc);
//   //   });
// });

app.get('/api/events/:id', function(req, res) {
  db.collection("events").findOne({_id: ObjectId(req.params.id)}, function(err, event) {
    res.json(event);
  });
});

app.delete('/api/events/:id', function(req, res) {
  console.log("Deleting event:", req.params.id);
  var oid = ObjectId(req.params.id);
  db.collection("events").deleteOne({_id: oid});
});

// app.put('/api/events/:id', function(req, res) {
//   var event = req.body;
//   console.log("New event:", req.params.id, event);
//   var oid = ObjectId(req.params.id);
//   db.collection("events").updateOne({_id: oid}, event, function(err, result) {
//     db.collection("events").find({_id: oid}).next(function(err, doc) {
//       res.send(doc);
//     });
//   });
// });



app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/static', 'index.html'))
 })

MongoClient.connect('mongodb://localhost/events-list_dev_db', function(err, dbConnection) {
  db = dbConnection;
 var server = app.listen(3000, function() {
   var port = server.address().port;
   console.log('Started server at port', port);
 });
});