//server/src/routes/admin/auth.route.js
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin/auth.controller');

router.post('/get-user-monitoring', authController.monitorUser);
router.put('/update-status/:id', authController.updateStatus);

module.exports = router;