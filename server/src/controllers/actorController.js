const Actor = require('../models/actorModel');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }).single('picture');
const pool = require('../config/db');

const actorController = {
    getAllActor: async (req, res) => {
        try {
            const actor = await Actor.getAll();
            res.json(actor);
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getActorByIdFilm: async (req, res) => {
        const { id } = req.params;
        try {
            const actors = await Actor.getByIdFilm(id);
            if (!actors.length) {
                return res.status(404).json({ message: 'No actors found for this film' });
            }
            res.json(actors);
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getActorById: async (req, res) => {
        const { id } = req.params;
        try {
            const actor = await Actor.getById(id);
            if (!actor) {
                return res.status(404).json({ message: 'Actor not found' });
            }
            res.json(actor);
        } catch (err) {
            console.error('Error fetching actor:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    createActor: async (req, res) => {
        const { country, name, birth_date, picture } = req.body;

        try {
            if (!picture || !picture.includes('base64')) {
                return res.status(400).json({ error: 'Invalid image format. Please provide a valid base64 image.' });
            }

            const pictureBuffer = Buffer.from(picture.split(',')[1], 'base64');

            const newActor = await Actor.create(country, name, birth_date, pictureBuffer);
            res.status(201).json({ message: 'Create new actor successfully', actor: newActor });
        } catch (err) {
            console.error('Error creating actor:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateActor: async (req, res) => {
        const { id } = req.params;
        const { country, name, birth_date, picture } = req.body;
        if (!country || !name || !birth_date || !picture) {
            console.log('sini kah');
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            if (picture.startsWith('data:image')) {
                pictureBuffer = Buffer.from(picture.split(',')[1], 'base64');
            } else {
                pictureBuffer = Buffer.from(picture, 'base64');
            }
            const updatedActor = await Actor.update(id, country, name, birth_date, pictureBuffer);
            if (!updatedActor) {
                return res.status(404).json({ message: 'Actor not found' });
            }
            res.json({ message: 'Actor berhasil diperbarui', actor: updatedActor });
        } catch (error) {
            res.status(500).json({ message: 'Error updating actor', error: error.message });
        }
    },

    deleteActor: async (req, res) => {
        const { id } = req.params;

        console.log(id);
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            await Actor.deleteActor(client, id);

            const deletedActor = await Actor.delete(client, id);
            if (!deletedActor) {
                return res.status(404).json({ message: 'Actor not found' });
            }
            
            await client.query('COMMIT');
            res.json({ message: 'Actor deleted successfully', actor: deletedActor });
        } catch (error) {
            await client.query('ROLLBACK');
            res.status(500).json({ message: 'Error deleting actor', error: error.message });
        } finally {
            client.release();
        }
    }
}

module.exports = actorController;