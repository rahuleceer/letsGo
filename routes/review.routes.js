const express = require('express');
const controller = require('../controller/review.controller');
const authController = require('../controller/authorization.controller');
const reviewRoute = express.Router();

reviewRoute.use(authController.authenticate);

reviewRoute.route('/').post(controller.addReview).get(controller.getReview);

module.exports = reviewRoute;
