const catchAsync = require('../utils/catch_async');
const _Error = require('../utils/_Error');

const Tours = require('../database/Schema/tours.schema');

const mongoose = require('mongoose');

module.exports.mark = async (req, res, next) => {
  const { id } = req.params;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    if (!id) {
      return next(new _Error('Please provide a Tour Id', 404));
    }

    const { mark } = req.query;

    if (!mark) {
      return next(new _Error('What you want to do like or dislike', 400));
    }

    console.log('Mark: ', mark, mark !== 'like', mark !== 'dislike');

    if (mark !== 'like' && mark !== 'dislike') {
      return next(new _Error('Please provide a valid mark', 400));
    }

    const tour = await Tours.findById(id);

    if (!tour) {
      return next(new _Error('Tour not found', 404));
    }

    if (mark === 'like') {
      await tour.like(req.user._id, session);
    }

    if (mark === 'dislike') {
      await tour.dislike(req.user._id, session);
    }

    await session.commitTransaction();
    res.status(200).json({
      status: 'success',
      message: `You ${mark}d this tour`,
      data: tour,
    });
  } catch (e) {
    console.log(e);
    session.abortTransaction();
    res.status(400).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }

  await session.endSession();
};
