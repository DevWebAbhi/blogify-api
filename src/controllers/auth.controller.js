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
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new ApiError(400, 'Name, email and password are required'));
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return next(new ApiError(400, 'Email already in use'));
    }

    const user = await User.create({ name, email, password });
    const token = generateToken({ id: user._id });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({ success: true, data: { user: userObj, token } });
  } catch (err) {
    console.log(err)
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
