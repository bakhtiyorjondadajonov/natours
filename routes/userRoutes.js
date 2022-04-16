const express = require('express');
const router = express.Router();
const userController = require(`../controllers/userController`);

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
