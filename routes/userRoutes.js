const express = require('express');
const router = express.Router();
const userController = require(`../controllers/userController`);
const authenticationController = require(`../controllers/authenticationController`);

// router.post('/signup', authenticationController.signUp);

router.route('/signup').post(authenticationController.signUp);

// router.route('/login').post();

router.post('/login', authenticationController.login);

router.post('/forgotPassword', authenticationController.forgotPassword);
router.patch('/resetPassword/:token', authenticationController.resetPassword);
router.patch(
  '/updateMyPassword',
  authenticationController.protect,
  authenticationController.updatePassword
);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUsers);

router
  .route('/:id')
  .get(userController.getAnuser)
  .patch(userController.updateUsers)
  .delete(userController.deleteUsers);

module.exports = router;
