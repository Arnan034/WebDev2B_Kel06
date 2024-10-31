const pool = require('../config/db');

class Actor {
    static async getAll() {
        const allActors = await pool.query('SELECT * FROM actor ORDER BY id_actor DESC');
        return allActors.rows.map(actor => ({
            id_actor: actor.id_actor,
            country: actor.country,
            name: actor.name,
            birth_date: actor.birth_date,
            picture: actor.picture ? actor.picture.toString('base64') : null
        }));
    }
    

    static async getByIdFilm(id) {
        const query = `
            SELECT a.name, a.picture, af.cast_as
            FROM actor_film AS af
            LEFT JOIN actor AS a ON a.id_actor = af.id_actor
            WHERE af.id_film = $1
        `;
        const result = await pool.query(query, [id]);

        return result.rows.map(actor => ({
            name: actor.name,
            picture: actor.picture ? actor.picture.toString('base64') : null,
            cast: actor.cast_as
        }));
    }

    static async getById(id) {
        const getById = await pool.query('SELECT * FROM actor WHERE id_actor = $1', [id]);
        return getById.rows[0];
    }

    static async create(country, name, birth_date, pictureBuffer) {
        const query = `
            INSERT INTO actor (country, name, birth_date, picture) 
            VALUES ($1, $2, $3, $4) RETURNING *
        `;
        const values = [country, name, birth_date, pictureBuffer];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async update(id, country, name, birth_date) {
        try {
            const updateActor = await pool.query(
                `UPDATE actor SET country = $1, name = $2, birth_date = $3 WHERE id_actor = $4 RETURNING *`,
                [country, name, birth_date, id]
            );
            return updateActor.rows[0];
        } catch (error) {
            console.error('Database update error:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const deleteActor = await pool.query(
                `DELETE FROM actor WHERE id_actor = $1 RETURNING *`,
                [id]
            );
            return deleteActor.rows[0];
        } catch (error) {
            console.error('Database delete error:', error);
            throw error;
        }
    }

    static async check(param) {
        let query, values;

        if (isNaN(param)) {
            // Jika param adalah string (name)
            query = 'SELECT * FROM actor WHERE name = $1';
            values = [param];
        } else {
            // Jika param adalah angka (id_actor)
            query = 'SELECT * FROM actor WHERE id_actor = $1';
            values = [parseInt(param, 10)];
        }

        const check = await pool.query(query, values);
        return check.rows[0];
    }
}

module.exports = Actor;
