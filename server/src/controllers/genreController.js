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
        const { genre } = req.body;
    
        try {
            // Pengecekan genre: Pastikan sudah menunggu hasil dari fungsi `check`
            const genreExists = await Genre.check(genre);
            if (genreExists) {
                return res.status(400).json({ message: 'Genre already exists' });
            }
    
            // Jika genre belum ada, buat genre baru
            const newGenre = await Genre.create(genre);
            res.status(201).json(newGenre);
        } catch (err) {
            console.error('Error creating genre:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateGenre: async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        try {
            if (!id || isNaN(id)) {
                return res.status(400).json({ message: 'Invalid ID' });
            }
            if (!name) {
                return res.status(400).json({ message: 'Genre name is required' });
            }
    
            if (await Genre.check(id)) {
                const genre = await Genre.update(id, name);
                res.json(genre);
            } else {
                console.log('Genre ID does not exist');
                res.status(404).json({ message: 'Genre ID not found' });
            }
        } catch (err) {
            console.error('Error updating genre:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deleteGenre: async (req, res) => {
        const { id_genre } = req.params; 
        console.log("ID received for deletion:", id_genre);
    
        try {
            const genreExists = await Genre.check(id_genre); 
            if (genreExists) {
                const deletedGenre = await Genre.delete(id_genre);
                res.json({
                    success: true,
                    message: `Genre ${deletedGenre.genre} deleted successfully!`,
                    Genre: deletedGenre
                });
            } else {
                res.status(404).json({ success: false, message: 'Genre not found' });
            }
        } catch (err) {
            console.error('Error deleting genre:', err.message);
            if (err.code === '23503') {
                res.status(400).json({
                    success: false,
                    message: 'Cannot delete genre as it is still referenced in other tables.'
                });
            } else {
                res.status(500).json({ success: false, message: 'Server error' });
            }
        }
    }
}

module.exports = genreController;