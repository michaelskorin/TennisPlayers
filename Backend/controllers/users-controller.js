const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    const err = new HttpError(
      'Invalid inputs passed, please check your data',
      422
    );
    return next(err);
  }

  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError('Signing up failed, please try again', 500);
    return next(err);
  }

  if (existingUser) {
    const err = new HttpError(
      'A username with this email already exists. Try logging in instead.',
      422
    );
    return next(err);
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    const err = new HttpError('Could not create user, please try again', 500);
    return next(err);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (error) {
    const err = new HttpError('Could not create user, please try again', 500);
    return next(err);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (error) {
    const err = new HttpError('Signing up failed, please try again', 500);
    return next(err);
  }

  res
    .status(200)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError('Logging in failed, please try again', 500);
    return next(err);
  }

  if (!existingUser) {
    const err = new HttpError('Invalid credentials, could not log in', 403);
    return next(err);
  }

  let isValidPassword;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    const err = new HttpError(
      'Could not log in, please check your credentials',
      500
    );
    return next(err);
  }

  if (!isValidPassword) {
    const err = new HttpError('Invalid credentials, please try again', 500);
    return next(err);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (error) {
    const err = new HttpError('Invalid credentials, please try again', 500);
    return next(err);
  }

  res
    .status(200)
    .json({ userId: existingUser.id, email: existingUser.email, token: token });
};

exports.signup = signup;
exports.login = login;
