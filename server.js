var express = require('express');
var bodyParser = require('body-parser');
require('es6-promise').polyfill();
require('isomorphic-fetch');
const cors = require('cors');
const { apiKey } = require('./resources/apiKey');
var port = 3001;

var app = express();
app.use(cors());
var server = require('http').createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var url_prefix = `https://api.darksky.net/forecast/${apiKey}/`;
app.get('/api/darksky', function(req, res) {
  try {
    var coordinates = req.query.latitude + ',' + req.query.longitude;
    var url = url_prefix + coordinates;
    console.log('Fetching ' + url);

    fetch(url)
      .then(function(response) {
        if (response.status != 200) {
          res
            .status(response.status)
            .json({ message: 'Bad response from Dark Sky server' });
        }
        return response.json();
      })
      .then(function(payload) {
        res.status(200).json(payload);
      });
  } catch (err) {
    console.log('Errors occurs requesting Dark Sky API', err);
    res
      .status(500)
      .json({ message: 'Errors occurs requesting Dark Sky API', details: err });
  }
});

server.listen(port);
console.log('Server is listening on port ' + port);
