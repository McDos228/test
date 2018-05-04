const express = require('express');
const app = express();
const index = require('./v1');

app.use('/api', index);


module.exports = app;