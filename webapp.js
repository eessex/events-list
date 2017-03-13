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
app.use('/events', router);
app.use('/new/event', router);
app.use('/info', router);
app.use('/', router);

app.listen(port);
console.log('Listening on port ' + port);

mongoose.connect(process.env.MONGODB_URI)

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();

var isProduction = process.env.NODE_ENV === 'production';
var publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));


// // Bundle Dev
if (!isProduction) {
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