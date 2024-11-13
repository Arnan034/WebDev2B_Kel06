const Country = require('../models/countryModel'); // Sesuaikan dengan model yang digunakan

const countries = {
    getAllCountries: async (req, res) => {
        try {
            const country = await Country.getAll();
            res.status(200).json(country);
        } catch (err) {
            console.error('01 Error Fetch All Country:', err.message);
            res.status(500).json({ message: 'Error Fetch All Country' });
        }
    },

    createCountry: async (req, res) => {
        const { country_name } = req.body;
        
        try {
            const existingCountry = await Country.check(country_name);

            if (existingCountry) {
                return res.status(400).json({ message: 'Country already exists' });
            }

            const newCountry = await Country.create(country_name);
            res.status(201).json(newCountry);
        } catch (err) {
            console.error('02 Error creating country:', err.message);
            res.status(500).json({ message: 'Creating country Failed' });
        }
    },

    updateCountry: async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        try {
            if (!id || isNaN(id)) {
                return res.status(400).json({ message: 'Invalid ID' });
            }
            if (!name) {
                return res.status(400).json({ message: 'Country name is required' });
            }
    
            if (await Country.check(id)) {
                const country = await Country.update(id, name);
                res.status(200).json(country);
            } else {
                console.log('Country ID does not exist');
                res.status(404).json({ message: 'Country ID not found' });
            }
        } catch (err) {
            console.error('03 Error updating country:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deleteCountry: async (req, res) => {
        const { id_country } = req.params; 
        console.log("ID received for deletion:", id_country);
    
        try {
            const countryExists = await Country.check(id_country); 
            if (countryExists) {
                const deletedCountry = await Country.delete(id_country); 
                res.status(200).json({
                    success: true,
                    message: `Country "${deletedCountry.country_name}" deleted successfully!`,
                    country: deletedCountry
                });
            } else {
                res.status(404).json({ success: false, message: 'Country not found' });
            }
        } catch (err) {
            console.error('04 Error deleting country:', err.message);
            if (err.code === '23503') {
                res.status(400).json({
                    success: false,
                    message: 'Cant delete the country because its still the movie being referenced.'
                });
            } else {
                res.status(500).json({ success: false, message: 'Server error' });
            }
        }
    }
};

module.exports = countries;