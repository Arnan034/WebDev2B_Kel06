const pool = require('../config/db');

class Award {
    static async getAll(){
        const allGenre = await pool.query('SELECT * FROM award ORDER BY id_award DESC');
        return allGenre.rows;
    }

    static async getInstitution() {
        const allAwards = await pool.query('SELECT DISTINCT institution FROM award');
        return allAwards.rows;
    }

    static async getUnselected(){
        const allGenre = await pool.query('SELECT * FROM award WHERE id_film IS NULL');
        return allGenre.rows;
    }

    static async create(institution, year, name) {
        const createAward = await pool.query(
            'INSERT INTO award (institution, year, name) VALUES ($1, $2, $3) RETURNING *',
            [institution, year, name]
        );
        return createAward.rows[0];
    }

    static async update(id, institution, year, name) {
        try {
            const updateAward = await pool.query(
                `UPDATE award SET institution = $1, year = $2, name = $3 WHERE id_award = $4 RETURNING *`,
                [institution, year, name, id]
            );
            return updateAward.rows[0];
        } catch (error) {
            console.error('Database update error:', error);
            throw error;
        }
    }

    static async updatefilm(client, id_award, id_film){
        const updateGenre = await client.query('UPDATE award SET id_film = $1 WHERE id_award = $2', [id_film, id_award]);
        return updateGenre.rows[0];
    }

    static async delete(id) {
        try {
            const deleteAward = await pool.query(
                'DELETE FROM award WHERE id_award = $1 RETURNING *',
                [id]
            );
            return deleteAward.rows[0];
        } catch (error) {
            console.error('Database delete error:', error);
            throw error;
        }
    }

    static async updateAwardFilm(client, id){
        await client.query('UPDATE award SET id_film = NULL WHERE id_film = $1;', [id]);
    }

    static async check(institution, year, name) {
        const check = await pool.query(
            'SELECT * FROM award WHERE institution = $1 AND year = $2 AND name = $3',
            [institution, year, name]
        );
        return check.rows[0];
    }
}

module.exports = Award;