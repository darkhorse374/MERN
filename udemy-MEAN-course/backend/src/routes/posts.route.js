const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const uploadImage = require('../middlewares/image-upload');
const PostController = require('../controllers/post.controller');

router.post('', checkAuth, uploadImage, PostController.createPost);

router.get('', PostController.getPosts);

router.get('/:id', PostController.getPost);

router.delete('/:id', checkAuth, PostController.deletePost);

router.put('/:id', checkAuth, uploadImage, PostController.updatePost);

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
