const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const dotenv = require('dotenv-safe');

dotenv
  .config({ path: './.env' })
  .then(console.log('successfully parsed .env'))
  .catch(err => {
    console.error(err);
  });

exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, process.env.SALT_ROUNDS)
    .then(hashPassword => {
      const user = new User({
        email: req.body.email,
        password: hashPassword,
      });
      user
        .save()
        .then(response => {
          res.status(201).json({
            message: 'User Created Successfully!',
            result: response,
          });
        })
        .catch(err => {
          res.status(500).json({
            error: {
              message: 'Invalid authentication credentials!',
            },
          });
        });
    })
    .catch(err => console.error(err));
};

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email,
  })
    .then(user => {
      if (!user) {
        throw new Error('User not registered');
      } else {
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      }
    })
    .then(result => {
      if (!result) {
        throw new Error('Invalid Password');
      } else {
        const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, process.env.JWT_KEY, {
          expiresIn: '1h',
        });
        res.status(200).json({
          userId: fetchedUser._id,
          token: token,
          expiresIn: 3600,
        });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(401).json({
        message: err.message,
      });
    });
};
