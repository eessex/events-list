var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventsSchema = new Schema({
  all_day: Boolean,
  description: String,
  end_date: Date,
  images: [{url: String}],
  organizer: String,
  slug: String,
  slugs: [String],
  start_date: Date,
  title: String,
  urls: [String],
  venue: String
});

module.exports = mongoose.model('Event', EventsSchema);

// var express = require('express');
// var router = express.Router();
// var mongoose = require('mongoose');
// var timestamps = require('mongoose-timestamp');
// // var expressJwt = require('express-jwt');


// var eventSchema = mongoose.Schema({
//   all_day: Boolean,
//   description: String,
//   end_date: Date,
//   images: [{url: String}],
//   organizer: String,
//   slug: String,
//   slugs: [String],
//   start_date: Date,
//   title: String,
//   urls: [String],
//   venue: String
// });

// eventSchema.plugin(timestamps);

// var Event = mongoose.model('Event', eventSchema);



// router.get('/events', function(req, res, next) {
//   // console.log("Query string", req.query);
//   // var filter = {};
//   // if (req.query.priority)
//   //   filter.priority = req.query.priority;
//   // if (req.query.published)
//   //   filter.published = req.query.published;

//   //  db.collection('events').find(filter).toArray(function(err, docs) {
//   //   res.json(docs);
//   // });

//   Event
//     .find({})
//     .select({
//       content: 0,
//       __v: 0,
//       updatedAt: 0,
//       createdAt: 0
//     })
//     .limit(100)
//     .sort({
//       createdAt: -1
//     })
//     .exec(function(err, events) {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({
//           message: 'Could not retrieve events'
//         });
//       }
//       res.json(events);
//     });
// });

// // router.event('/events', function(req, res, next) {
// //   var user = req.user;
// //   if (!user) {
// //     return res.status(401).json({
// //       message: 'Permission Denied!'
// //     });
// //   } else if (!user.isEmailVerified) {
// //     return res.status(401).json({
// //       message: 'Permission Denied! Please verify your email.'
// //     });
// //   }

// //   console.dir(req.user);

// //   var body = req.body;
// //   var title = body.title;
// //   var categories = body.categories;
// //   var content = body.content;

// //   //simulate error if title, categories and content are all "test"
// //   //This is demo field-validation error upon submission. 
// //   if (title === 'test' && categories === 'test' && content === 'test') {
// //     return res.status(403).json({
// //       message: {
// //         title: 'Title Error - Cant use "test" in all fields!',
// //         categories: 'Categories Error',
// //         content: 'Content Error',
// //         submitmessage: 'Final Error near the submit button!'
// //       }
// //     });
// //   }

// //   if (!title || !categories || !content) {
// //     return res.status(400).json({
// //       message: 'Error title, categories and content are all required!'
// //     });
// //   }

// //   var event = new Event({
// //     title: title,
// //     categories: categories.split(','),
// //     content: content,
// //     authorName: req.user.name,
// //     authorUsername: req.user.username,
// //     authorId: req.user._id,
// //     authorImage: req.user.image
// //   });


// //   event.save(function(err, event) {
// //     if (err) {
// //       console.log(err);
// //       return res.status(500).json({
// //         message: 'Could not save event'
// //       });
// //     }
// //     res.json(event);
// //   });
// // });

// // router.get('/events/:id', function(req, res, next) {
// //   Event.findById({
// //     '_id': req.params.id
// //   }, function(err, event) {
// //     if (err) {
// //       console.log(err);
// //       return res.status(500).json({
// //         message: 'Could not retrieve event w/ that id'
// //       });
// //     }
// //     if (!event) {
// //       return res.status(404).json({
// //         message: 'Event not found'
// //       })
// //     }
// //     res.json(event);
// //   });
// // });

// // router.delete('/events/:id', function(req, res, next) {
// //   if (!req.user || !req.user.isEmailVerified) {
// //     return res.status(401).json({
// //       message: 'Permission Denied!'
// //     });
// //   }

// //   var id = req.params.id;
// //   if (id.length != 24) {
// //     return res.json({
// //       message: 'id must be a valid 24 char hex string'
// //     });
// //   }
// //   var id = mongoose.Types.ObjectId(req.params.id); //convert to objectid
// //   Event.findByIdAndRemove(id, function(err, event) {
// //     if (err)
// //       throw err;

// //     if (!event) {
// //       return res.status(404).json({
// //         message: 'Could not delete event'
// //       });
// //     }

// //     res.json({
// //       result: 'Event was deleted'
// //     });

// //   });
// // });

// // router.event('/events/validate/fields', function(req, res, next) {
// //   var body = req.body;
// //   var title = body.title ? body.title.trim() : '';

// //   Event.findOne({
// //     'title': new RegExp(title, "i")
// //   }, function(err, event) {
// //     if (err) {
// //       console.log(err);
// //       return res.status(500).json({
// //         message: 'Could not find event for title uniqueness'
// //       });
// //     }
// //     if (event) {
// //       res.json({
// //         title: 'Title "' + title + '" is not unique!'
// //       });
// //     } else {
// //       return res.json({});
// //     }

// //   });
// // });


// module.exports = router;