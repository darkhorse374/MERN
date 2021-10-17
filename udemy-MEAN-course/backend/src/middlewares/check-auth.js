const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const tokenData = jwt.verify(token, process.env.JWT_KEY);
    console.log('token-data: ' + tokenData);
    req.userData = { email: tokenData.email, userId: tokenData.userId };
    next();
  } catch (error) {
    res.status(401).json({
      error: { message: 'User authentication failed' },
    });
  }
};
