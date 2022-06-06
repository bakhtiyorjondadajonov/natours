const express = require('express');
const multer = require('multer');

const router = express.Router();
const userController = require(`../controllers/userController`);
const authenticationController = require(`../controllers/authenticationController`);

router.route('/signup').post(authenticationController.signUp);

router.post('/login', authenticationController.login);
router.get('/logout', authenticationController.logout);
router.post('/forgotPassword', authenticationController.forgotPassword);
router.patch('/resetPassword/:token', authenticationController.resetPassword);

router.use(authenticationController.protect);

router.patch('/updateMyPassword', authenticationController.updatePassword);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);
router.route('/me').get(userController.getMe, userController.getAnuser);
router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getAnuser)
  .patch(
    authenticationController.restrictTo('admin'),
    userController.updateUser
  )
  .delete(userController.deleteUser);

module.exports = router;
