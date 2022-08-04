const catchAsync = require('../utils/catch_async');
const _Error = require('../utils/_Error');

const Review = require('../database/Schema/review.schema');

module.exports.addReview = catchAsync(async (req, res, next) => {
  const { review, tour } = req.body;

  const newReview = await Review.create({
    tourist: req.user._id,
    review,
    tour,
  });

  res.status(200).json({
    status: 'success',
    message: 'Review added successfully',
    data: newReview,
  });
});

module.exports.getReview = catchAsync(async (req, res, next) => {
 

  const newReview = await Review.find().populate("tourist tour")

  res.status(200).json({
    status: 'success',
    message: 'Review added successfully',
    data: newReview,
  });
});
