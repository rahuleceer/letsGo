const express = require('express');
const controller = require('../controller/authentication.controller');
const authController = require('../controller/authorization.controller');

const authRoute = express.Router();

authRoute.route('/sign_up').post(controller.singUp);

authRoute.route('/sign_in').post(controller.login);

authRoute.route('/forget_password').get(controller.forgotPassword);

authRoute.route('/reset_password').post(controller.resetPassword);

authRoute.route('/whoami').get(authController.whoami);

module.exports = authRoute;
