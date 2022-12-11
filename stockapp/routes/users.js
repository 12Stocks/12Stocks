const express = require('express');
const router = express.Router();

var UserController = require("../controllers/userController");

router.get('/', UserController.findAll);
router.get('/admin_panel', UserController.Allview);
router.get('/user_info/:user_id', UserController.findById);
router.get('/user_form/:user_id', UserController.find_own);
router.get('/user_edit/:user_id', UserController.edit);
router.post('/user_edit/:user_id', UserController.update);
router.get('/user_add', UserController.form);
router.post('/user_add', UserController.create);
router.get('/users_admin/:user_id', UserController.admin_edit);
router.post('/users_admin/:user_id', UserController.admin_update);
router.get('/:id', UserController.delete);
module.exports = router;