const express = require('express');
const multer = require('multer');
const Post = require('../models/post.model');
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid FileType');

    if (isValid) error = null;

    cb(error, './storage/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  },
});

router.post('', checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId,
  });
  post
    .save()
    .then(createdPost => {
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
    })
    .catch(error => {
      res.status(500).json({
        error: {
          message: 'Unable to create post\nPlease retry',
        },
      });
    });
  // const post = req.body;
  // console.log(post);
});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(doc => {
      fetchedPosts = doc;
      return Post.count();
    })
    .then(count => {
      console.log(fetchedPosts);
      res.status(200).json({
        message: 'Post retrieved successfuly',
        posts: fetchedPosts,
        totalPosts: count,
      });
    })
    .catch(err => {
      console.error(`unable to fetch records :: ${err}`);
      res.status(500).json({
        error: {
          message: 'Unable to fetch posts\nPlease retry',
        },
      });
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        console.log(`Post with ID ${req.params.id} was deleted`);
        res.status(200).json({
          message: 'Post deleted',
        });
      } else {
        res.status(401).json({
          error: { message: 'Not authorized to delete post' },
        });
      }
    })
    .catch(err => {
      console.error(`unable to delete post with ID ${req.params.id} :: ${err}`);
      res.status(500).json({
        error: {
          message: 'Unable to delete post\nPlease retry',
        },
      });
    });
});

router.put('/:id', checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.nModified > 0) {
        res.status(200).json({ message: `Post with ID ${req.params.id} is updated successfully` });
      } else {
        res.status(401).json({ error: { message: 'Not authorized to update the post' } });
      }
    })
    .catch(error => {
      res.status(500).json({
        error: {
          message: 'Unable to update post\nPlease retry',
        },
      });
    });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(doc => {
      if (doc) {
        doc.creator = req.userData.userId;
        res.status(200).json({
          message: 'Post retrieved successfuly',
          posts: doc,
        });
      } else {
        res.status(404).json({
          error: { message: 'Post not found' },
        });
      }
    })
    .catch(err => {
      console.error(`unable to fetch records :: ${err}`);
      res.status(500).json({
        error: {
          message: 'Unable to fetch post\nPlease retry',
        },
      });
    });
});

// router.use('', (req, res, next) => {
//   const posts = [
//     {
//       id: 'f0afw3423',
//       title: 'Demo Post',
//       content: 'Demo post retrieved from backend',
//     },
//     {
//       id: 'f0afw8564',
//       title: 'Another Post',
//       content: 'Another demo post retrieved from backend',
//     },
//   ];
//   res.status(200).json({
//     message: 'Posts data',
//     posts: posts,
//   });
//   // res.send('Hello from express!');
// });

module.exports = router;
