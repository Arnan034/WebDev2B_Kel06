//server/src/routes/admin/award.route.js
const express = require('express');
const router = express.Router();
const awardController = require('../../controllers/admin/award.controller.js');

router.get('/get-all', awardController.getAllAward);
router.post('/create', awardController.createAward);
router.put('/update/:id', awardController.updateAward);
router.delete('/delete/:id', awardController.deleteAward);

module.exports = router;