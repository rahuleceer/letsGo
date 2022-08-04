const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    tourist: {
      type: mongoose.Schema.Types.ObjectId, // Object id
      ref: 'User', // collection of which model is referring to
    },
    review: {
      type: String,
      required: [true, 'Review is required'],
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId, // Object id
      ref: 'Tour', // collection of which model is referring to
    },
    date : {
        type: Date,
        default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

const Review = model('Review', reviewSchema);

module.exports = Review;
