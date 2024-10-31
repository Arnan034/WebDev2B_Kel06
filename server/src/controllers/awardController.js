const Award = require('../models/awardModel'); // Sesuaikan dengan model yang digunakan

const awardController = {
    getAllAward: async (req, res) => {
        try {
            const award = await Award.getAll();
            res.json(award);
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getNameAward: async (req, res) => {
        try {
            const award = await Award.getName();
            res.json(award);
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    createAward: async (req, res) => {
        const { institution, year, name } = req.body;
        try {
            const existingAward = await Award.check(institution, year, name);
    
            if (!existingAward) {
                const newAward = await Award.create(institution, year, name);
                res.json(newAward);
            } else {
                console.log('Award already exists');
                res.status(400).json({ message: 'Award already exists' });
            }
        } catch (err) {
            console.error('Error creating award:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateAward: async (req, res) => {
        const { id } = req.params;
        const { institution, year, name } = req.body;
      
        if (!institution || !year || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }
      
        try {
            const updatedAward = await Award.update(id, institution, year, name);
            if (!updatedAward) {
                return res.status(404).json({ message: 'Award not found' });
            }
            res.json({ message: 'Award berhasil diperbarui', award: updatedAward });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    deleteAward: async (req, res) => {
        const { id } = req.params;
      
        try {
            const deletedAward = await Award.delete(id);
            if (!deletedAward) {
                return res.status(404).json({ message: 'Award not found' });
            }
            res.json({ message: 'Award deleted successfully', award: deletedAward });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },     
}

module.exports = awardController;