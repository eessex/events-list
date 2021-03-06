# API Tests

# test GET on /api/bugs: returns array of bugs
curl -v localhost:3000/api/events

# Same test with a If-None-Match that matches a previous etag. This
# will return a 304.
curl -v --header 'If-None-Match: W/"b5-F1b7cwQ6h9O04csif+Wqkw"' localhost:3000/api/events

# Test POST to create a new bug and return it.
# Won't work if type is not set to */* in bodyParser.
curl -v \
  --data '{"title":"New event added via api"}' \
  http://localhost:3000/api/events

curl -v \
  --header 'Content-Type: application/json' \
  --data '{"title":"New event added via api"}' \
  http://localhost:3000/api/events