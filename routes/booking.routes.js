const express = require('express');
const controller = require('../controller/booking.controller');
const authController = require('../controller/authorization.controller');
const route = express.Router();

route.use(authController.authenticate);

//` booking cancel
//` booking get all
//` booking get one


route.route('/:id').post(controller.createBooking)

module.exports = route;
