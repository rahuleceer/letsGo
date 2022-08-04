const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const origin = ['http://localhost:3000', 'http://localhost:3001'];

app.use(
  cors({
    origin,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/tours', require('./routes/tours.routes'));
app.use('/api/v1/review', require('./routes/review.routes'));
app.use('/api/v1/booking', require('./routes/booking.routes'));

app.use('/api/v1/mark', require('./routes/mark.routes'));

app.use('/api/v1/auth', require('./routes/authentication.routes'));

app.use('/api/v1/test', require('./routes/test.routes'));

// # Global Error Handling Middleware
app.use((err, req, res, next) => {
  const errStatus = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const status = err.status || 'error';


  res.status(errStatus).json({ message, status });
});

app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Not found',
  });
});

module.exports = app;
