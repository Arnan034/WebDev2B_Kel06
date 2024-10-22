const Actor = require('../models/actorModel'); // Sesuaikan dengan model yang digunakan

const actor = {
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
            const actor = await Actor.getByIdFilm(id);
            res.json(actor);
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    createActor: async (req, res) => {
        const { name } = req.query;
        try {
            if (!Actor.check(name)) {
                const actor = await Actor.create(name);
                res.json(actor);
            } else {
                console.log('Country Already exists');
            }
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateActor: async (req, res) => {
        const { id } = req.params;
        const { name } = req.query;
        try {
            if (Actor.check(id)) {
                const actor = await Actor.update(id, name);
                res.json(actor);
            } else {
                console.log('Country Already exists');
            }
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deleteActor: async (req, res) => {
        const { id } = req.params;
        try {
            if (Actor.check(id)) {
                const actor = await Actor.delete(id);
                res.json(actor);
            } else {
                console.log('Country Not exists');
            }
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },
}

module.exports = actor;