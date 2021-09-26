const express = require('express');
const Post = require('../models/post.model');
const router = express.Router();

router.post('', (req, res, next) => {
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

router.get('', (req, res, next) => {
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

router.delete('/:id', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.status(200).json({ message: `Post with ID ${req.params.id} is updated successfully` });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(doc => {
      if (doc) {
        res.status(200).json({
          message: 'Post retrieved successfuly',
          posts: doc,
        });
      } else {
        res.status(404).json({
          message: 'Post not found',
        });
      }
    })
    .catch(err => {
      console.error(`unable to fetch records :: ${err}`);
    });
});

router.use('', (req, res, next) => {
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

module.exports = router;