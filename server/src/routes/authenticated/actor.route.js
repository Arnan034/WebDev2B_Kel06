//server/src/routes/authenticated/actor.route.js
const express = require('express');
const router = express.Router();
const actorController = require('../../controllers/authenticated/actor.controller');

router.get('/get-all', actorController.getAllActor);

module.exports = router;
