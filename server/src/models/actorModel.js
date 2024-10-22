const pool = require('../config/db');

class Actor {
    static async getAll () {
        const result = await pool.query('SELECT * FROM actor');
        const monthNames = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];

        return result.rows.map(actor => {
            const birthDate = new Date(actor.birth_date);
    
            const formattedBirthDate = `${String(birthDate.getDate()).padStart(2, '0')} ${monthNames[birthDate.getMonth()]} ${birthDate.getFullYear()}`;
    
            return {
                id: actor.id_actor,
                name: actor.name,
                country: actor.country,
                birthdate: formattedBirthDate, // Menggunakan format yang baru
                picture: actor.picture.toString('base64'),
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
        const getById = await pool.query('');
        return getById.rows[0];
    }

    static async create(name){
        const createGenre = await pool.query('');
        return createGenre.rows[0];

    }

    static async update(id, name){
        const updateGenre = await pool.query('');
        return updateGenre.rows[0];
    }

    static async delete(id){
        const deleteGenre = await pool.query('');
        return deleteGenre.rows[0];
    }

    static async check(name){
        const check = await pool.query('SELECT * FROM actor WHERE name = $1 OR id = $1', [name]);
        return check.rows[0];
    }
}

module.exports = Actor;