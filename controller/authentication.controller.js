const User = require('../database/Schema/user.schema');
const _Error = require('../utils/_Error');
const catchAsync = require('../utils/catch_async');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const sendMail = require('../utils/send_mail');

module.exports.singUp = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, phone, photo, organizer } = req.body;

  //   if (password !== confirmPassword) {
  //     return next(new _Error('Passwords do not match 😁😁', 400));
  //   }

  const user = await User.create({
    name,
    email,
    password,
    confirmPassword,
    phone,
    photo,
    role: organizer ? 'organizer' : 'tourist',
  });

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h',
    }
  );

  res.cookie('authorization', token, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    status: 'success',
    message: 'User created successfully',
    data: token,
  });
});

module.exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new _Error('Please provide email and password', 400));
  }

  const user = await User.findOne({
    email,
  }).select('+password');


  //# just to fix
  // if (password === user.password) {
  //   //  ? password is correct but it is not hashed

  //   user.password = await bcrypt.hash(this.password, 12);

  //   await user.save();
  // }


  // ! switch to invalid email or password error

  if (!user) {
    return next(new _Error('Invalid Email', 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new _Error('Password is wrong.', 401));
  }

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h',
    }
  );

  // # EXPLAIN THE BELOW LINE
  res.cookie('authorization', token, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    status: 'success',
    message: 'User logged in successfully',
    token,
  });
});

module.exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new _Error('User with that email does not exist', 404));
  }

  await user.generateOTP();

  await sendMail({
    to: email,
    subject: 'Reset Password OTP ',
    text: `Your OTP is ${user.OTP}`,
  });

  res.status(200).json({
    status: 'success',
    message: 'OTP sent to your email',
  });
});

module.exports.resetPassword = catchAsync(async (req, res, next) => {
  const { OTP } = req.query;

  if (!OTP) {
    return next(new _Error('Please provide OTP', 400));
  }

  const user = await User.findOne({ OTP });

  if (!user) {
    return next(new _Error('Invalid OTP', 404));
  }

  if (user.OTPExpiry < Date.now()) {
    return next(new _Error('OTP expired', 404));
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new _Error('Passwords do not match 😁😁', 400));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;

  user.OTP = undefined;
  user.OTPExpiry = undefined;

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password reset successfully',
  });
});
