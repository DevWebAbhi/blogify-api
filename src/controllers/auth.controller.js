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

const _parseExpiryToMs = (str) => {
  if (!str) return 7 * 24 * 60 * 60 * 1000; // default 7 days
  if (/^\d+$/.test(str)) return parseInt(str, 10) * 1000;
  const unit = str.slice(-1);
  const num = parseInt(str.slice(0, -1), 10);
  if (unit === 'd') return num * 24 * 60 * 60 * 1000;
  if (unit === 'h') return num * 60 * 60 * 1000;
  if (unit === 'm') return num * 60 * 1000;
  if (unit === 's') return num * 1000;
  return 7 * 24 * 60 * 60 * 1000;
};

const _cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: _parseExpiryToMs(process.env.JWT_EXPIRES_IN || '7d'),
});

const register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return next(new ApiError(400, 'Name, username, email and password are required'));
    }

    // Let MongoDB enforce uniqueness (race-safe). Unique/index errors are handled by the error handler.
    const user = await User.create({ name, username, email, password });
    const token = generateToken({ id: user._id });

      // Set HttpOnly cookie with the JWT
      res.cookie('jwt', token, _cookieOptions());

      return res.status(201).json({
        success: true,
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

    // Set JWT as HttpOnly cookie
    res.cookie('jwt', token, _cookieOptions());

    return res.status(200).json({ success: true, data: { user: userObj } });
  } catch (err) {
    return next(err);
  }
};

const logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 0, httpOnly: true });
  return res.status(200).json({ success: true });
};

module.exports = { register, login, logout, generateToken };
