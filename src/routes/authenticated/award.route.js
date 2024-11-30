//server/src/routes/authenticated/award.route.js
const express = require('express');
const router = express.Router();
const awardController = require('../../controllers/authenticated/award.controller.js');

router.get('/get-unselected', awardController.getUnselectedAward);

module.exports = router;