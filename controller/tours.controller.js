const Tours = require('../database/Schema/tours.schema');
const catchAsync = require('../utils/catch_async');
const _Error = require('../utils/_Error');

const addTour = catchAsync(async (req, res, next) => {
  const { name, duration, maxGroupSize, difficulty, price } = req.body;

  const newTour = await Tours.create({
    name,
    duration,
    maxGroupSize,
    difficulty,
    price,
    organizer : req.user._id,
  });



  res.status(200).json({
    status: 'success',
    message: 'Tour added successfully',
    data: newTour,
  });
});

const getTours = catchAsync(async (req, res, next) => {
  let { query } = req; // query is an object

  query = JSON.stringify(query); // convert query to string

  query = query.replace(/\b(gt|gte|lt|lte)\b/g, (match) => {
    return `$${match}`;
  }); // find all the gt|gte|lt|lte and replace them with $gt|$gte|$lt|$lte

  query = JSON.parse(query); // convert query string to object

  query.organizer = req.user._id; // add organizer to query

  const allTours = await Tours.find(query)
    .select({
      __v: 0,
    })
    .populate('organizer');

  res.status(200).json({
    status: 'success',
    message: `Hello , ${req.user.name} you have ${allTours.length} tours`,
    data: allTours,
  });
});

const getTourById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const tour = await Tours.findById(id);
  res.status(200).json({
    status: 'success',
    message: 'Tour found',
    data: tour,
  });
});

const updateTour = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updateTour = await Tours.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Tour updated successfully',
    data: updateTour,
  });
});

module.exports = {
  addTour,
  getTours,
  getTourById,
  updateTour,
};
