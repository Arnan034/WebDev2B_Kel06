const Country = require('../models/countryModel'); // Sesuaikan dengan model yang digunakan

const countries = {
    getAllCountries: async (req, res) => {
        try {
            const country = await Country.getAll();
            res.json(country);
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    createCountry: async (req, res) => {
        const { name } = req.query;
        try {
            if (!Country.check(name)) {
                const country = await Country.create(name);
                res.json(country);
            } else {
                console.log('Country Already exists');
            }
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateCountry: async (req, res) => {
        const { id } = req.params;
        const { name } = req.query;
        try {
            if (Country.check(id)) {
                const country = await Country.update(id, name);
                res.json(country);
            } else {
                console.log('Country ID Not exists');
            }
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deleteCountry: async (req, res) => {
        const { id } = req.params;
        try {
            if (Country.check(id)) {
                const country = await Country.delete(id);
                res.json(country);
            } else {
                console.log('Country Not exists');
            }
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },
};

module.exports = countries;