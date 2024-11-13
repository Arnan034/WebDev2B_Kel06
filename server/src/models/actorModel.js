const pool = require('../config/db');

class Actor {
    static async getAll () {
        const result = await pool.query('SELECT * FROM actor ORDER BY id_actor DESC');
        const monthNames = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];

        return result.rows.map(actor => {
            const birthDate = new Date(actor.birth_date);
    
            const formattedBirthDate = `${String(birthDate.getDate()).padStart(2, '0')} ${monthNames[birthDate.getMonth()]} ${birthDate.getFullYear()}`;
    
            return {
                id_actor: actor.id_actor,
                name: actor.name,
                country: actor.country,
                birth_date: formattedBirthDate,
                picture: actor.picture ? actor.picture.toString('base64') : null,
            };
        });
    }

    static async getByIdFilm(id){
        const query = `
            SELECT a.name, a.picture, af.cast_as
            FROM actor_film AS af
            LEFT JOIN actor AS a ON a.id_actor = af.id_actor
            WHERE af.id_film = $1
        `;
        const result =  await pool.query(query, [id]);
    
        return result.rows.map(actor => ({
            name: actor.name,
            picture: actor.picture.toString('base64'),
            cast: actor.cast_as
        }));
    } 

    static async getById(id){
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

    static async update(id, country, name, birth_date, pictureBuffer) {
        try {
            const updateActor = await pool.query(
                `UPDATE actor SET country = $1, name = $2, birth_date = $3, picture = $4 WHERE id_actor = $5 RETURNING *`,
                [country, name, birth_date, pictureBuffer, id]
            );
            return updateActor.rows[0];
        } catch (error) {
            console.error('Database update error:', error);
            throw error;
        }
    }

    static async delete(client, id) {
        try {
            const deleteActor = await client.query(
                `DELETE FROM actor WHERE id_actor = $1 RETURNING *`,
                [id]
            );
            return deleteActor.rows[0];
        } catch (error) {
            console.error('Database delete error:', error);
            throw error;
        }
    }

    static async addActorFilm(client, id_actor, cast, film_id) {
        try {
            const addActor = await client.query(
                `INSERT INTO actor_film (id_film, id_actor, cast_as) VALUES ($1, $2, $3) RETURNING *`,
                [film_id, id_actor, cast]
            );
            return addActor.rows[0];
        } catch (error) {
            console.error('Error adding actor to film:', error);
            throw new Error('Failed to add actor to film');
        }
    }
    
    // static async addActorFilm(id_actor, cast, film_id){
    //     const addActor = await pool.query(`INSERT INTO actor_film (id_film, id_actor, cast_as) VALUES ($1, $2, $3) RETURNING *`, [film_id, id_actor, cast]);
    //     return addActor.rows[0];
    // }

    static async deleteActorFilm(client, id){
        await client.query('DELETE FROM actor_film WHERE id_film = $1;', [id]);
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

    static async deleteActor(client, id){
        await client.query('DELETE FROM actor_film WHERE id_actor = $1;', [id]);
    }
}

module.exports = Actor;