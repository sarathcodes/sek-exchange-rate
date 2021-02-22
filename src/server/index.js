const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./user');
const currencyRouter = require('./currency');
const locationRouter = require('./location');
const requestLimitter = require('./requestLimitter');

const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json({ limit: '1mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
app.use('/auth', userRouter);
app.use('/api', requestLimitter);
app.use('/api/location', locationRouter);

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
