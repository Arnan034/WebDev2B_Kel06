//server/src/routes/public/actor.route.js
const express = require('express');
const router = express.Router();
const actorController = require('../../controllers/public/actor.controller');

router.get('/get-by-id-film/:id_film', actorController.getActorByIdFilm);
router.get('/get-by-id/:id', actorController.getActorById);

module.exports = router;