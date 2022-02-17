const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts.route');
const userRoutes = require('./routes/users.route');
const path = require('path');
const dotenv = require('dotenv-safe');

dotenv.config({ path: './.env' });

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.error(`Connection to database failed :: ${err}`);
  });

const app = express().disable('x-powered-by');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use((req, res, next) => {
//     console.log('Server started');
//     next();
// });
app.use('/images', express.static(path.join('storage/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
