//server/src/routes/public/award.route.js
const express = require('express');
const router = express.Router();
const awardController = require('../../controllers/public/award.controller.js');

router.get('/get-institution', awardController.getInstitutionAward);

module.exports = router;