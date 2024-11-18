//server/src/routes/admin/actor.route.js
const express = require('express');
const router = express.Router();
const actorController = require('../../controllers/admin/actor.controller');

router.post('/create', actorController.createActor);
router.put('/update/:id', actorController.updateActor);
router.delete('/delete/:id', actorController.deleteActor);

module.exports = router;