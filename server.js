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
  const { latitude, longitude } = req.query;
  const url_prefix = `https://api.darksky.net/forecast/${
    process.env.DARK_SKY_KEY
  }/`;

  try {
    const coordinates = `${latitude},${longitude}`;
    var url = url_prefix + coordinates;
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
    res
      .status(500)
      .json({ message: 'Errors occurs requesting Dark Sky API', details: err });
  }
});

app.get('/api/pixabay', function(req, res) {
  const { q, category } = req.query;
  const url = `https://pixabay.com/api/?key=${
    process.env.PIXABAY_KEY
  }&q=${q}&category=${category}`;
  try {
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
        res.status(200).json(payload);
      });
  } catch (err) {
    res.status(500).json({
      message: 'Error has occured requesting Pixabay API',
      details: err
    });
  }
});

app.get('/api/giphy', function(req, res) {
  const { q } = req.query;
  const url = `https://api.giphy.com/v1/gifs/search?q=${q}&api_key=${
    process.env.GIPHY_KEY
  }&limit=200`;
  try {
    fetch(url)
      .then(response => {
        if (response.status != 200) {
          res
            .status(response.status)
            .json({ message: 'Bad response from Giphy server' });
        }
        return response.json();
      })
      .then(payload => {
        res.status(200).json(payload);
      });
  } catch (err) {
    res.status(500).json({
      message: 'Error has occurred requesting Giphy API',
      details: err
    });
  }
});

server.listen(port);
console.log('Server is listening on port ' + port);
