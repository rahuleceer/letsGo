const express = require('express');
const controller = require('../controller/test.controller');
const authController = require('../controller/authorization.controller');

const testRoute = express.Router();

testRoute.use(authController.authenticate);

testRoute.route('/:id').post(controller.test);

module.exports = testRoute;
