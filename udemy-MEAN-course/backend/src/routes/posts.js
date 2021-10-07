const express = require('express');
const multer = require('multer');
const Post = require('../models/post.model');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid FileType');

    if (isValid)
      error = null
    
    cb(error, './storage/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', multer({ storage: storage }).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
  });
  post.save().then(createdPost => {
    console.log(`result :: ${createdPost}`);
    res.status(201).json({
      message: 'Post was successfuly saved',
      post: {
        id: createdPost._id,
        ...createdPost,
        // title: createdPost.title,
        // content: createdPost.content,
        // imagePath: createdPost.imagePath
      },
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
    // _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.body.imagePath,
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