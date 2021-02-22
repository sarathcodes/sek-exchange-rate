const jwt = require('jsonwebtoken');
const { secret, apiLimitPerMinute } = require('../../config');

const API_HIT_LIMIT = {};

// this function would both verify the token and
// checks limit of API being used
const limitter = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    const userId = decoded.id;
    const expiredTime = new Date().getTime() - (60 * 1000);
    const userData = API_HIT_LIMIT[userId];
    if (userData && userData.timestamp >= expiredTime) {
      if (userData.tokens === 0) {
        return res.status(403).send({ status: 'failure', message: 'API limit reached.' });
      }
      userData.tokens -= 1;
      return next();
    }

    API_HIT_LIMIT[userId] = {
      timestamp: new Date().getTime(),
      tokens: apiLimitPerMinute - 1
    };
    return next();
  });
};

module.exports = limitter;
