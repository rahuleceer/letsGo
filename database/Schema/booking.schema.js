const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
    },
    tourist: {
      type: Schema.Types.ObjectId,
      ref: 'Tourist',
    },

  },
  {
    timestamps: true,
  }
);

const Bookings = model('Bookings', bookingSchema);

module.exports = Bookings;
