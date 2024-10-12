const Filter = require('../models/filterModel'); // Sesuaikan dengan model yang digunakan

const filterController = {
    getYears: async (req, res) => {
        try {
            const filter = await Filter.getYears();
            res.json(filter);
        } catch (err) {
            console.error('Error fetching year:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getAvailabilitys: async (req, res) => {
        try {
            const filter = await Filter.getAvailabilitys();
            res.json(filter);
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = filterController;