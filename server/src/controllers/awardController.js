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
        const { name } = req.query;
        try {
            if (!Award.check(name)) {
                const award = await Award.create(name);
                res.json(award);
            } else {
                console.log('Country Already exists');
            }
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateAward: async (req, res) => {
        const { id } = req.params;
        const { name } = req.query;
        try {
            if (Award.check(id)) {
                const award = await Award.update(id, name);
                res.json(award);
            } else {
                console.log('Country ID Not exists');
            }
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deleteAward: async (req, res) => {
        const { id } = req.params;
        try {
            if (Award.check(id)) {
                const award = await Award.delete(id);
                res.json(award);
            } else {
                console.log('Award Not exists');
            }
        } catch (err) {
            console.error('Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = awardController;