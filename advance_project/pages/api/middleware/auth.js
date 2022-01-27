const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    console.log('me inside protec',req?.cookies?.token)
  let token = req?.cookies?.token;
  if (
    req.headers?.authorization &&
    req.headers?.authorization?.startsWith('Bearer')
  ) {
    token = req.headers?.authorization?.split(' ')[1];
  } 

  if (!token) {
    return res
      .status(401)
      .json({ message: 'You are not allowed to access this endpoint' });
  }

  try {
    const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = user;
    return next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'You not authorized to enter this endpoint' });
    }
    next();
  };
};