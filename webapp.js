var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
require('dotenv').load();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;
var router = express.Router();

var Event = require('./models/events')


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Request-Headers", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

router.route('/api/events')
  .post(function(req, res) {
    var event = new Event();
    event = req.body;
    event.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Event created.' });
    });
  })
  .get(function(req, res) {
    Event.find(function(err, events) {
      if (err)
        res.send(err);
      res.json(events);
    });
  });

router.route('/api/events/:_id')
  .get(function(req, res) {
    Event.findById(req.params._id, function(err, events) {
      if (err) {
        res.send(err);
      } else {
        res.json(events);
      }
    });
  })
  .put(function(req, res) {
    Event.findById(req.params._id, function(err, event) {
      if (err)
        res.send(err);
      event = req.body;
      event.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'Event updated.' })
      })
    })
  })
  .delete(function(req, res) {
    Event.remove({
      _id: req.params._id
    }, function(err, event) {
      if (err)
        res.send(err);
      res.json({ message: 'Successfully deleted.' })
    });
  });


router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/', 'index.html'))
});


app.use('/events/:_id', router);
app.use('/events/new', router);
app.use('/info', router);
app.use('/', router);

app.listen(port);
console.log('Listening on port ' + port);

mongoose.connect(process.env.MONGODB_URI)

var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer();


var isProduction = process.env.NODE_ENV === 'production';
// var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // Run server
// // MongoClient.connect(process.env.MONGODB_URI, function(err, dbConnection) {
// //   db = dbConnection;
// //   var server = app.listen(port, function() {
// //     console.log('Started server at port', port);
// //   });
// // });

// // Bundle Dev
if (!isProduction) {
  console.log('in bundle, not production')
  var bundle = require('./server/bundle.js');
  bundle();
  // Any requests to localhost:3000/public is proxied
  // to webpack-dev-server
  app.all('/public/*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://localhost:8081'
    });
  });
}
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

// app.use('api', require('./routes/events')());


// // API
// // app.get('/api/events', function(req, res) {
// //   console.log("Query string", req.query);
// //   var filter = {};
// //   if (req.query.priority)
// //     filter.priority = req.query.priority;
// //   if (req.query.published)
// //     filter.published = req.query.published;

// //    db.collection('events').find(filter).toArray(function(err, docs) {
// //     res.json(docs);
// //   });
// // });

// // app.post('/api/events/', function(req, res) {
// //   console.log("New event:", req.body);
// //   var newEvent = req.body;
// //   db.collection("events").insertOne(newEvent, function(err, result) {
// //     var id = result.insertedId;
// //     db.collection("events").find({_id: id}).next(function(err, doc) {
// //       res.json(doc);
// //     });
// //   });
// // });

// // app.patch('/api/events/:id', function (req, res) {
// //   console.log("Update Event:", req.body);
// //   var updateEvent = req.body;
// //   var id = req.params.id;
// //   db.collection("events").update({_id: ObjectId(id)}, {$set: updateEvent}, function(err, result) {
// //     db.collection("events").find({_id: ObjectId(id)}).next(function(err, doc) {
// //       console.log('successfully saved')
// //       res.send(doc);
// //     });
// //   });
// // });

// // app.get('/api/events/:id', function(req, res) {
// //   db.collection("events").findOne({_id: ObjectId(req.params.id)}, function(err, event) {
// //     res.json(event);
// //   });
// // });

// // app.delete('/api/events/:id', function(req, res) {
// //   console.log("Deleting event:", req.params.id);
// //   var id = ObjectId(req.params.id);
// //   db.collection("events").deleteOne({_id: id});
// // });

// app.get('*', function (req, res) {
//     res.sendFile(path.join(__dirname, '/public/', 'index.html'))
//  })
