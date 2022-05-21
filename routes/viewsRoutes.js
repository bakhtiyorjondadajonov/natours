const express = require('express');
const viewsController = require('../controllers/viewsController');
const router = express.Router();

router.route('/').get(viewsController.getOverview);
router.route('/tour/:tourName').get(viewsController.getTour);
router.route('/login').get(viewsController.getLoginForm);
// create /login route
//
module.exports = router;
