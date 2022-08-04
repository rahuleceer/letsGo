const catchAsync = require('../utils/catch_async');
const _Error = require('../utils/_Error');

const Booking = require('../database/Schema/booking.schema');
const Invoice = require('../database/Schema/invoice.schema');
const Tours = require('../database/Schema/tours.schema');

const mongoose = require('mongoose');

module.exports.createBooking = async (req, res, next) => {
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const tour = await Tours.findById(id);

    if (tour.tourists.includes(req.user.id)) {
      return next(new _Error('You are already booked for this tour', 400));
    }

    if (tour.tourists.length + 1 > tour.maxGroupSize) {
      return next(new _Error('Tour is full', 400));
    }

    const booking = await Booking.create(
      [
        {
          tour: tour._id,
          tourist: mongoose.Types.ObjectId(req.user.id),
        },
      ],
      {
        session,
      }
    );

    await Invoice.create(
      [
        {
          booking: booking._id,
          price: tour.price,
          paymentMode: 'Paypal',
        },
      ],
      {
        session,
      }
    );

    tour.tourists.push(req.user.id);
    await tour.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      status: 'success',
      data: booking,
      message: 'Booking created successfully',
    });
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
    next(new _Error(e.message, 500));
  }
};
