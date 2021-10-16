const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, 'just_a_long_sting_for_creating_a_long_jsonwebtoken_which_can_be_secure');
      next();
  } catch (error) {
    res.status(401).json({
      message: 'Authenticating the token failed',
    });
  }
};
