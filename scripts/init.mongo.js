var db = new Mongo().getDB("events-list_dev_db");

db.events.remove({});

db.events.insert([
  {priority: 'P1', status:'Open', owner:'Ravan', title:'App crashes on open'},
  {priority: 'P2', status:'New', owner:'Eddie', title:'Misaligned border on panel'}
]);