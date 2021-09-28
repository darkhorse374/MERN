const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoute = require('./routes/posts')

mongoose
  .connect('mongodb://localhost:27017/udemy-MEAN-app')
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.error(`Connection to database failed :: ${err}`);
  });


const app = express();

// app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use((req, res, next) => {
//     console.log('Server started');
//     next();
// });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

app.use('/api/posts', postsRoute);

module.exports = app;
