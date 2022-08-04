const express = require('express');

const controller = require('../controller/mark.controller');
const authController = require('../controller/authorization.controller');

const route = express.Router();

route.use(authController.authenticate);

route.route('/:id').post(controller.mark);

module.exports = route;
