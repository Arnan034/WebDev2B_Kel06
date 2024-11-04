const Comment = require('../models/commentModel'); // Sesuaikan dengan model yang digunakan


const commentController = {
    getAllComments: async (req, res) => {
        const { filter } = req.query;
        try {
            const comments = await Comment.findAll(filter);
            res.status(200).json(comments);
        } catch (error) {
            console.log("Error Comment 01: ", error);
            res.status(500).json({ message: error.message });
        }
    },

    getCommentByIdFilm: async (req, res) => {
        const { id } = req.params;
        const { filter } = req.query;
        try {
            const comment = await Comment.findByIdFilm(id, filter);
            res.status(200).json(comment);
        } catch (error) {
            console.log("Error Comment 02: ", error);
            res.status(500).json({ message: error.message });
        }
    },

    createComment: async (req, res) => {
        const { userId, filmId } = req.params;
        const { rating, review } = req.body;
        try {
            await Comment.create( userId, filmId, rating, review)
            res.status(201).json("Comment created");
        } catch (error) {
            console.log("Error Comment 03: ", error);
            res.status(400).json({ message: error.message });
        }
    },

    updateApproveComment: async (req, res) => {
        const { ids } = req.body;
        try {
            if (Array.isArray(ids) && ids.length > 0) {
                const updateApprove = ids.map(id => Comment.approveComment(id));
                await Promise.all(updateApprove); 
            } else {
                return res.status(400).json({ message: 'Invalid or empty ID list.' });
            }
            res.status(200).json({ message: 'Comments approved successfully.' });
        } catch (error) {
            console.log("Error Comment 04: ", error);
            res.status(400).json({ message: error.message });
        }
    },

    deleteComment: async (req, res) => {
        const { ids } = req.body;
        try {
            if (Array.isArray(ids) && ids.length > 0) {
                const deleteComment = ids.map(id => Comment.deleteComment(id));
                await Promise.all(deleteComment);
            } else {
                return res.status(400).json({ message: 'Invalid or empty ID list.' });
            }
            
            res.status(200).json({ message: 'Delete Comment successfully.' });
        } catch (error) {
            console.log("Error Comment 05: ", error);
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = commentController;