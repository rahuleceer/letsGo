const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const invoiceSchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    paymentMode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = model('Invoice', invoiceSchema);

module.exports = Invoice;
