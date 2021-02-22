const axios = require('axios');
const { restCountryAPIKey } = require('../../config');

let previouslyCachedTimestamp = null;
const localConversionRate = {};

const updateConversionToSEK = (conversionInEuro) => {
  const euroToSEK = conversionInEuro.SEK;
  for (const [key, value] of Object.entries(conversionInEuro)) {
    localConversionRate[key] = value / euroToSEK;
  }
};

const getConversionRate = () => {
  axios.get(`http://data.fixer.io/api/latest?access_key=${restCountryAPIKey}`)
    .then((response) => {
      const { success, timestamp, rates } = response.data;
      // Update local data only when there's an update in currency rate
      if (success && previouslyCachedTimestamp !== timestamp) {
        updateConversionToSEK(rates);
        previouslyCachedTimestamp = timestamp;
      }
    })
    .catch((error) => {
      console.error('Cannot get currency conversion info', error);
    });
};

getConversionRate();
// setInterval(() => {
//   getConversionRate();
// }, 5000);

const getLatestRates = () => localConversionRate;

module.exports = getLatestRates;
