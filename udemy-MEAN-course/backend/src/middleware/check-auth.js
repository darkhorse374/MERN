const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const tokenData = jwt.verify(token, 'just_a_long_sting_for_creating_a_long_jsonwebtoken_which_can_be_secure');
    req.userData = { email: tokenData.email, userId: tokenData.userId };
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Authenticating the token failed',
    });
  }
};
