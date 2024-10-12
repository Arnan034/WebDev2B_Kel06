const express = require('express');
const router = express.Router();
const { getAllAward, getNameAward, createAward, updateAward, deleteAward } = require('../controllers/awardController.js');

// Rute untuk genre
router.get('/', getAllAward);
router.get('/name', getNameAward);
router.post('/', createAward);
router.put('/:id', updateAward);
router.delete('/:id', deleteAward);

module.exports = router;