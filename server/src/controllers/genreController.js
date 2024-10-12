const Genre = require('../models/genreModel'); // Sesuaikan dengan model yang digunakan

const genreController = {
    getAllGenres: async (req, res) => {
        try {
            const genre = await Genre.getAll();
            res.json(genre);
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getGenreById: async (req, res) => {
        const { id } = req.params;
        try {
            const genre = await Genre.getById(id);
            res.json(genre);
            
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    createGenre: async (req, res) => {
        const { name } = req.query;
        try {
            if (!Genre.check(name)) {
                const genre = await Genre.create(name);
                res.json(genre);
            } else {
                console.log('Country Already exists');
            }
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateGenre: async (req, res) => {
        const { id } = req.params;
        const { name } = req.query;
        try {
            if (Genre.check(id)) {
                const genre = await Genre.update(id, name);
                res.json(genre);
            } else {
                console.log('Country ID Not exists');
            }
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deleteGenre: async (req, res) => {
        const { id } = req.params;
        try {
            if (Genre.check(id)) {
                const genre = await Genre.delete(id);
                res.json(genre);
            } else {
                console.log('Genre Not exists');
            }
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = genreController;