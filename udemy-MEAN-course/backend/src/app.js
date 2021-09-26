const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/udemy-MEAN-app')
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => {
    console.error(`Connection to database failed :: ${err}`);
  });

const Post = require('./models/post.model');
const app = express();

app.use(bodyParser.json());
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

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then(createdPost => {
    console.log(`result :: ${createdPost}`);
      res.status(201).json({
        message: 'Post was successfuly saved',
        postId: createdPost._id,
      });
  });
  // const post = req.body;
  // console.log(post);
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(doc => {
      console.log(doc);
      res.status(200).json({
        message: 'Post retrieved successfuly',
        posts: doc,
      });
    })
    .catch(err => {
      console.error(`unable to fetch records :: ${err}`);
    });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(() => {
      console.log(`Post with ID ${req.params.id} was deleted`);
      res.status(200).json({
        message: 'Post deleted',
      });
    })
    .catch(err => {
      console.error(`unable to delete post with ID ${req.params.id} :: ${err}`);
    });
});

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'f0afw3423',
      title: 'Demo Post',
      content: 'Demo post retrieved from backend',
    },
    {
      id: 'f0afw8564',
      title: 'Another Post',
      content: 'Another demo post retrieved from backend',
    },
  ];
  res.status(200).json({
    message: 'Posts data',
    posts: posts,
  });
  // res.send('Hello from express!');
});

module.exports = app;
