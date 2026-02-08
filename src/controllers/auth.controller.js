const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  if (!secret) {
    throw new ApiError(500, 'Authentication configuration error');
  }
  return jwt.sign(payload, secret, { expiresIn });
};

const register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return next(new ApiError(400, 'Name, username, email and password are required'));
    }

    // Let MongoDB enforce uniqueness (race-safe). Unique/index errors are handled by the error handler.
    const user = await User.create({ name, username, email, password });
    const token = generateToken({ id: user._id });

    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email }
    });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ApiError(400, 'Email and password are required'));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const token = generateToken({ id: user._id });
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({ success: true, data: { user: userObj, token } });
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, login, generateToken };
