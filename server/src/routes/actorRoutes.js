const express = require('express');
const router = express.Router();
const { getAllActor, getActorByIdFilm, getActorById, createActor, updateActor, deleteActor } = require('../controllers/actorController');

// Rute untuk aktor
router.get('/all', getAllActor);
router.get('/list/:id', getActorByIdFilm);
router.get('/:id', getActorById);
router.post('/', createActor);
router.put('/:id', updateActor);
router.delete('/:id', deleteActor);

module.exports = router;