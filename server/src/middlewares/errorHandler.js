const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Menampilkan error di konsol

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;