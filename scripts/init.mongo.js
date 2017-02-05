var db = new Mongo().getDB("events-list_dev_db");

db.events.remove({});

db.events.insert([]);