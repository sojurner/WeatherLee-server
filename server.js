const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
require('es6-promise').polyfill();
require('isomorphic-fetch');
const cors = require('cors');
const port = process.env.PORT || 3001;

const app = express();
const server = require('http').createServer(app);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/darksky', function(req, res) {
  const url_prefix = `https://api.darksky.net/forecast/${
    process.env.DARK_SKY_KEY
  }/`;
  try {
    const coordinates = `${req.query.latitude},${req.query.longitude}`;
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

app.get('/api/pixabay', function(req, res) {
  const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=${
    req.query.query
  }`;
  try {
    console.log('Fetching' + url);
    fetch(url)
      .then(response => {
        if (response.status != 200) {
          res
            .status(response.status)
            .json({ message: 'Bad response from PixaBay server' });
        }
        return response.json();
      })
      .then(payload => {
        console.log(payload);
        res.status(200).json(payload);
      });
  } catch (err) {
    console.log('Error has occured requesting Pixabay API', err);
    res.status(500).json({
      message: 'Error has occured requesting Pixabay API',
      details: err
    });
  }
});

server.listen(port);
console.log('Server is listening on port ' + port);
