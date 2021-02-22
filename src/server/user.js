/* eslint-disable consistent-return */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../../config');

// Since we are not going to use an actual DB for this demo,
// I am going to hard code some user info here. The password
// of the users is encrypted using bcrypt
const USERS = {
  'alice@ccc.com': {
    id: 'alice@ccc.com',
    name: 'Alice Jane',
    pwd: '$2a$10$Q9UIv8fzLhD0suRGZJT4veiy8LV3NKMYibEi3wqy9iIIJnJMc6p6C' // abcd1234
  },
  'bob@ccc.com': {
    id: 'bob@ccc.com',
    name: 'Bob Bale',
    pwd: '$2a$10$JNT.wO62F.KuUefaDzh6bu.9j6jf8rVrj5rK1YHaKm.v7dto40KiC' // 1234abcd
  }
};

const router = express.Router();

// login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!USERS[email]) return res.status(404).send({ auth: false, message: 'No user found.'});

  const passwordIsValid = bcrypt.compareSync(password, USERS[email].pwd);
  if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

  const token = jwt.sign({ id: email }, secret, {
    expiresIn: 60 * 60 // expires in 1 hour
  });

  res.status(200).send({
    auth: true, token, name: USERS[email].name, id: email
  });
});

// get my info from token
router.get('/me', (req, res) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    const user = USERS[decoded.id];

    if (!user) return res.status(500).send({ auth: false, message: 'User data not found in DB.' });

    res.status(200).send({ ...decoded, name: user.name });
  });
});

module.exports = router;
