const express = require('express');
const viewsController = require('../controllers/viewsController');
const authenticationController = require('../controllers/authenticationController');
const router = express.Router();
router.use(authenticationController.isLoggedIn);
router.route('/').get(viewsController.getOverview);
router.route('/tour/:tourName').get(viewsController.getTour);
router.route('/login').get(viewsController.getLoginForm);
// create /login route
//
module.exports = router;
