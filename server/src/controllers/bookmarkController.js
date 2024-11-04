const Bookmark = require('../models/bookmarkModel'); // Sesuaikan dengan model yang digunakan

const bookmark = {
    getBookmarkFilm: async (req, res) => {
        const { userId } = req.params;
        try {
            const bookmark = await Bookmark.getBookmark(userId);
            res.json(bookmark);
        } catch (err) {
            console.error('01 Error Get Bookmark Movie:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getUserBookmarkFilm: async (req, res) => {
        const { userId, filmId } = req.params;
        try {
            const bookmark = await Bookmark.getUserBookmark(userId, filmId);
            if (bookmark) {
                res.json({ isBookmarked: true });
            } else {
                res.json({ isBookmarked: false });
            }
        } catch (err) {
            console.error('02 Error Get Status Bookmark Movie:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    createBookmark: async (req, res) => {
        const { userId, filmId } = req.body;
        try {
            await Bookmark.addBookmark(userId, filmId);
            res.status(200).json({ message: 'Bookmark added successfully' });
        } catch (err) {
            console.error('03 Error Create Bookmark Movie:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deleteBookmark: async (req, res) => {
        const { userId, filmId } = req.params;
        try {
            const result = await Bookmark.delBookmark(userId, filmId);
            if (result) {
                res.status(200).send({ message: 'Bookmark removed successfully' });
            } else {
                res.status(404).send({ error: 'Bookmark not found' });  // Jika bookmark tidak ditemukan
            }
        } catch (error) {
            console.error('04 Error Delete Bookmark Movie:', err.message);
            res.status(500).send({ error: 'Error removing bookmark' });
        }
    }
};

module.exports = bookmark;