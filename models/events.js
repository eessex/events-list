var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventsSchema = new Schema({
  _id: Schema.Types.ObjectId,
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