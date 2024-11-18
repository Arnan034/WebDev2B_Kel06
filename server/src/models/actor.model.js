const pool = require('../config/db');
const QueryOptimizer = require('../utils/performance/queryOptimizer.utils');
const { convertBufferToBase64 } = require('../utils/security/image.utils');

class Actor {
    static async getAll () {
        const query = 'SELECT * FROM actor ORDER BY id_actor DESC';
        const result = await QueryOptimizer.executeQuery(pool, query, [], 'getAllActor');
        const monthNames = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];

        return result.map(actor => {
            const birthDate = new Date(actor.birth_date);
    
            const formattedBirthDate = `${String(birthDate.getDate()).padStart(2, '0')} ${monthNames[birthDate.getMonth()]} ${birthDate.getFullYear()}`;
    
            return {
                id_actor: actor.id_actor,
                name: actor.name,
                country: actor.country,
                birth_date: formattedBirthDate,
                picture: actor.picture ? convertBufferToBase64(actor.picture) : null,
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
        const result = await QueryOptimizer.executeQuery(pool, query, [id], 'getActorByIdFilm');
    
        return result.map(actor => ({
            name: actor.name,
            picture: actor.picture ? convertBufferToBase64(actor.picture) : null,
            cast: actor.cast_as
        }));
    } 

    static async getById(id){
        const query = 'SELECT * FROM actor WHERE id_actor = $1';
        const result = await QueryOptimizer.executeQuery(pool, query, [id], 'getActorById');
        
        if (!result || result.length === 0) {
            return null;
        }

        const actor = result[0];
        return {
            id_actor: actor.id_actor,
            name: actor.name,
            country: actor.country,
            birth_date: actor.birth_date,
            picture: actor.picture ? convertBufferToBase64(actor.picture) : null,
        };
    }

    static async create(country, name, birth_date, pictureBuffer) {
        const query = `
            INSERT INTO actor (country, name, birth_date, picture) 
            VALUES ($1, $2, $3, $4) RETURNING *
        `;
        const values = [country, name, birth_date, pictureBuffer];
        const result = await QueryOptimizer.executeQuery(pool, query, values, 'createActor');
        return result[0];
    }

    static async update(id, country, name, birth_date, pictureBuffer) {
        try {
            const query = `
                UPDATE actor SET country = $1, name = $2, birth_date = $3, picture = $4 WHERE id_actor = $5 RETURNING *
            `;
            const values = [country, name, birth_date, pictureBuffer, id];
            const result = await QueryOptimizer.executeQuery(pool, query, values, 'updateActor');
            return result[0];
        } catch (error) {
            console.error('Database update error:', error);
            throw error;
        }
    }

    static async delete(client, id) {
        try {
            const query = `DELETE FROM actor WHERE id_actor = $1 RETURNING *`;
            const result = await QueryOptimizer.executeQuery(client, query, [id], 'deleteActor');
            return result[0];
        } catch (error) {
            console.error('Database delete error:', error);
            throw error;
        }
    }

    static async addActorFilm(client, id_actor, cast, film_id) {
        try {
            const query = `
                INSERT INTO actor_film (id_film, id_actor, cast_as) VALUES ($1, $2, $3) RETURNING *
            `;
            const result = await QueryOptimizer.executeQuery(client, query, [film_id, id_actor, cast], 'addActorFilm');
            return result[0];
        } catch (error) {
            console.error('Error adding actor to film:', error);
            throw new Error('Failed to add actor to film');
        }
    }

    static async deleteActorFilm(client, id){
        const query = 'DELETE FROM actor_film WHERE id_film = $1;';
        const result = await QueryOptimizer.executeQuery(client, query, [id], 'deleteActorFilm');
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

        const result = await QueryOptimizer.executeQuery(pool, query, values, 'checkActor');
        return result[0];
    }

    static async deleteActor(client, id){
        const query = 'DELETE FROM actor_film WHERE id_actor = $1;';
        const result = await QueryOptimizer.executeQuery(client, query, [id], 'deleteActorFilm');
    }
}

module.exports = Actor;