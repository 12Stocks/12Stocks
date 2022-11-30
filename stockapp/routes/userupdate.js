const express = require('express');
const router = express.Router();
const userupdateController = require('../controllers/userupdateController');

// Routes

router.get('/', userupdateController.view);
router.post('/', userupdateController.find);
router.get('/user_edit/:user_id', userupdateController.edit);
router.post('/user_edit/:user_id', userupdateController.update);
module.exports = router;