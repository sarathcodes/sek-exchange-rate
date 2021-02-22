/* eslint-disable consistent-return */
const express = require('express');
const axios = require('axios');
const getLatestRates = require('./currency');
const router = express.Router();

router.get('/lookup', (req, res) => {
  const { name } = req.query;
  if (name && name.length >= 2) {
    axios.get(`https://restcountries.eu/rest/v2/name/${name}`)
      .then(response => res.json({
        status: 'success',
        response: response.data
      }))
      .catch((error) => {
        return res.json({
          status: 'failure',
          message: 'Cannot retrieve country data',
          reason: error
        });
      });
  } else {
    res.json({
      status: 'success',
      response: []
    });
  }
});

router.get('/conversionRate', (req, res) => {
  res.json({
    status: 'success',
    response: getLatestRates()
  });
});

module.exports = router;
