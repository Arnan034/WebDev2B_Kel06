const Film = require('../models/filmModel'); // Sesuaikan dengan model yang digunakan

const filmController = {
    getAllFilms: async (req, res) => {
        const { country } = req.query;
        try {
            const film = await Film.getAll(country);
            res.json(film);
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getFilmById: async (req, res) => {
        const { id } = req.params;
        try {
            const film = await Film.getById(id);
            res.json(film);
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },
    
    getFilmSearch: async (req, res) => {
        let { country, search } = req.query;
        try {
            const films = await Film.getBySearch(country, search);
            res.json(films);
        } catch (err) {
            console.error('Error fetching search:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    }, 

    createFilm: async (req, res) => {
    
    },

    updatePlusView: async (req, res) => {
        const { id } = req.params;
        try {
            await Film.plusView(id);
            res.status(200).json({ message: 'View incremented successfully' });
        } catch (err) {
            console.error('Error fetching search:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },  

    updateFilm: async (req, res) => {
    
    },

    deleteFilm: async (req, res) => {
    
    },

};

module.exports = filmController;