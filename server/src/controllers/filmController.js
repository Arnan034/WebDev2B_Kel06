const pool = require('../config/db');
const Film = require('../models/filmModel');
const Award = require('../models/awardModel');
const Genre = require('../models/genreModel');
const Actor = require('../models/actorModel');

const filmController = {
    getAllFilms: async (req, res) => {
        const { country, sort, year, availability, genre, award, status } = req.query;
        try {
            const film = await Film.getAll(country, sort, year, availability, genre, award, status);
            res.json(film);
        } catch (err) {
            console.error('01 Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getValidateFilms: async (req, res) => {
        const { filter } = req.query;
        try {
            const film = await Film.getAllValidate(filter);
            res.json(film);
        } catch (err) {
            console.error('02 Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getFilmById: async (req, res) => {
        const { id } = req.params;
        try {
            const film = await Film.getById(id);
            res.json(film);
        } catch (err) {
            console.error('03 Error fetching movies:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },
    
    getFilmSearch: async (req, res) => {
        const { search, sort, country, year, availability, genre, award, status } = req.query;
        try {
            const films = await Film.getBySearch(search, sort, country, year, availability, genre, award, status);
            res.json(films);
        } catch (err) {
            console.error('04 Error fetching search:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    }, 

    createFilm: async (req, res) => {
        const {
            title,
            alt_title,
            year,
            country,
            synopsis,
            link_trailer,
            availability,
            status,
            posted_by,
            award,
            genre,
            actor,
        } = req.body;
    
        // Pastikan file gambar diunggah
        if (!req.file) {
            return res.status(400).send({ message: 'File gambar diperlukan.' });
        }
    
        console.log(genre, actor);
        // Parsing data
        const parsedAward = JSON.parse(award);
        const parsedGenre = JSON.parse(genre);
        const parsedActor = actor ? actor.map(actorStr => JSON.parse(actorStr)) : [] ;
        const pictureBuffer = req.file.buffer;
        // console.log(title,
        //     alt_title,
        //     year,
        //     country,
        //     synopsis,
        //     link_trailer,
        //     availability,
        //     status,
        //     posted_by,parsedAward, parsedGenre, parsedActor);

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Simpan film ke database
            const film_id = await Film.create(
                title,
                pictureBuffer,
                alt_title,
                year,
                country,
                synopsis,
                link_trailer,
                availability,
                status,
                posted_by
            );
            
            const operations = []; // Array untuk menyimpan semua promise
    
            // Simpan penghargaan
            if (parsedAward && parsedAward.length > 0) {
                const awardPromises = parsedAward.map(({ value }) => {
                    return Award.updatefilm(client, value, film_id);
                });
                operations.push(...awardPromises);
            }

            // Simpan genre
            if (parsedGenre && parsedGenre.length > 0) {
                const genrePromises = parsedGenre.map(id_genre => {
                    return Genre.addGenreFilm(client, id_genre.id, film_id);
                });
                operations.push(...genrePromises);
            }
            
            // Simpan aktor
            if (parsedActor && parsedActor.length > 0) {
                const actorPromises = parsedActor.map(actor => {
                    return Actor.addActorFilm(client, actor.id, actor.cast, film_id);
                });
                operations.push(...actorPromises);
            }
            
            // Tunggu semua operasi selesai
            await Promise.all(operations);
    
            await client.query('COMMIT');
            res.status(201).send({ message: 'Film berhasil dibuat' });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('05 Error Create movie:', error);
            res.status(500).send({ message: 'Terjadi kesalahan saat membuat film', error: error.message });
        } finally {
            client.release();
        }
    },

    updatePlusView: async (req, res) => {
        const { id } = req.params;
        try {
            await Film.plusView(id);
            res.status(200).json({ message: 'View incremented successfully' });
        } catch (err) {
            console.error('06 Error View Increment:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    createBookmark: async (req, res) => {
        const { userId, filmId } = req.body;
        try {
            await Film.addBookmark(userId, filmId);
            res.status(200).json({ message: 'View incremented successfully' });
        } catch (err) {
            console.error('Error fetching search:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateFilmValidate: async (req, res) => {
        const { id_film } = req.params;
        // const { validate } = req.body; // Mengambil dari body, bukan query
        try {
            await Film.updateValidate(id_film);
            res.status(200).json({ message: 'Film di Approve' });
        } catch (err) {
            console.error('07 Error Update Film:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    saveEditValidate: async (req, res) => {
        const { id_film } = req.params;
        const {
            title,
            picture,
            alt_title,
            year,
            country,
            synopsis,
            link_trailer,
            availability,
            status,
            genre,
            actor,
        } = req.body;
    
        // Check for required fields
        if (!title || !year || !country) {
            return res.status(400).send({ message: 'Title, year, and country are required.' });
        }
    
        const parsedGenre = JSON.parse(genre || '[]');
        const parsedActor = actor ? actor.map(actorStr => JSON.parse(actorStr)) : [];

        let pictureBuffer;
        if (picture.startsWith('data:image')) {
            pictureBuffer = Buffer.from(picture.split(',')[1], 'base64');
        } else {
            pictureBuffer = Buffer.from(picture, 'base64');
        }
    
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
    
            await Actor.deleteActorFilm(client, id_film);
    
            await Genre.deleteGenreFilm(client, id_film);
    
            // Update film details
            await Film.updateEditFilm(client, id_film, title, pictureBuffer, alt_title, year, country, synopsis, link_trailer, availability, status);
    
            // Insert new genres
            if (parsedGenre.length > 0) {
                for (const id_genre of parsedGenre) {
                    await Genre.addGenreFilm(client, id_genre.id, id_film);
                }
            }
            
            // Insert new actors
            if (parsedActor.length > 0) {
                for (const actor of parsedActor) {
                    await Actor.addActorFilm(client, actor.id, actor.cast, id_film);
                }
            }

            // Commit the transaction
            await client.query('COMMIT');
            res.status(201).send({ message: 'Film berhasil Save' });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error during transaction:', error);
            res.status(500).send({ message: 'Terjadi kesalahan saat membuat film', error: error.message });
        } finally {
            client.release();
        }
    },

    deleteFilm: async (req, res) => {
        const { id } = req.params;
        const client = await pool.connect();
        try{
            await client.query('BEGIN');
            
            await Award.updateAwardFilm(client, id);
            
            await Actor.deleteActorFilm(client, id);

            await Genre.deleteGenreFilm(client, id);

            await Film.delete(client, id);
            await client.query('COMMIT');
            res.status(200).json({ message: 'Film deleted successfully' });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('09 Error Delete Film:', err.message);
            res.status(500).json({ message: 'Server error' });
        } finally {
            client.release();
            console.log('Done delete film');
        }
    },

    getEditFilm: async (req, res) => {
        const { id } = req.params;
        console.log('masuk sini id 1x: ', id);
        try {
            const filmDetails = await Film.getFilmEdit(id);
        
            if (!filmDetails) {
                return res.status(404).json({ message: 'Film not found' });
            }
        
            res.status(200).json(filmDetails);
        } catch (error) {
            console.error('10 Error Fetch Edit Film:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    }

};

module.exports = filmController;