const express = require('express');
const controller = require('../controller/tours.controller');
const authController = require('../controller/authorization.controller');

const { restrictTo } = require('../function/restrictTo');
const tourRoute = express.Router();

tourRoute.use(authController.authenticate);

tourRoute
  .route('/')
  .post(restrictTo(['organizer']), controller.addTour)
  .get(controller.getTours);

tourRoute
  .route('/:id')
  .get(authController.authenticate, controller.getTourById)
  .patch(restrictTo(['organizer']), controller.updateTour)
  .delete(restrictTo(['organizer']), (req, res, next) => {
    res.send('DELETED');
  });

module.exports = tourRoute;
