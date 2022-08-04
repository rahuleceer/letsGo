const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [20, 'Name must be at most 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
      type: String,
      enum: ['tourist', 'organizer'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      unique: true,
      validate(value) {
        //` value is the "value" of current field i.e. phone
        if (!validator.isMobilePhone(value, 'en-IN')) {
          throw new Error('Phone Number is invalid');
        }
      },
    },
    photo: {
      type: String,
    },
    OTP: {
      type: Number,
      default: 0,
    },
    OTPExpiry: {
      type: Date,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [3, 'Password must be at least 3 characters'],
      maxlength: [255, 'Password must be at most 255 characters'],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Confirm Password is required'],
      minlength: [3, 'Confirm Password must be at least 3 characters'],
      maxlength: [255, 'Confirm Password must be at most 255 characters'],
      validate: {
        validator: function (value) {
          //` this is targeting the document which is getting saved to
          //` value is the "value" of current field i.e. confirmPassword
          return this.password === value;
        },
        message: 'Password and Confirm Password must be the same',
      },
    },

    liked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
      },
    ],
    disliked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
      },
    ],
    reviews: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'user',
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
  }

  next();
});

userSchema.methods.generateOTP = async function () {
  this.OTP = Math.floor(Math.random() * 1000000);
  this.OTPExpiry = new Date(Date.now() + 1000000);

  await this.save({ validateBeforeSave: false });
};

const User = model('User', userSchema);

module.exports = User;
