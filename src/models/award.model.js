const pool = require('../config/db');
const QueryOptimizer = require('../utils/performance/queryOptimizer.utils');

class Award {
    static async getAll(){
        const query = 'SELECT * FROM award ORDER BY id_award DESC';
        const result = await QueryOptimizer.executeQuery(pool, query, [], 'getAllAward');
        return result;
    }

    static async getInstitution() {
        const query = 'SELECT DISTINCT institution FROM award';
        const result = await QueryOptimizer.executeQuery(pool, query, [], 'getInstitution');
        return result;
    }

    static async getUnselected(){
        const query = 'SELECT * FROM award WHERE id_film IS NULL';
        const result = await QueryOptimizer.executeQuery(pool, query, [], 'getUnselected');
        return result;
    }

    static async create(institution, year, name) {
        const query = 'INSERT INTO award (institution, year, name) VALUES ($1, $2, $3) RETURNING *';
        const result = await QueryOptimizer.executeQuery(pool, query, [institution, year, name], 'createAward');
        return result[0];
    }

    static async update(id, institution, year, name) {
        const query = 'UPDATE award SET institution = $1, year = $2, name = $3 WHERE id_award = $4 RETURNING *';
        const result = await QueryOptimizer.executeQuery(pool, query, [institution, year, name, id], 'updateAward');
        return result[0];
    }

    static async updatefilm(client, id_award, id_film){
        const query = 'UPDATE award SET id_film = $1 WHERE id_award = $2';
        const result = await QueryOptimizer.executeQuery(client, query, [id_film, id_award], 'updateFilmAward');
        return result[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM award WHERE id_award = $1 RETURNING *';
        const result = await QueryOptimizer.executeQuery(pool, query, [id], 'deleteAward');
        return result[0];
    }

    static async updateAwardFilm(client, id){
        const query = 'UPDATE award SET id_film = NULL WHERE id_film = $1;';
        const result = await QueryOptimizer.executeQuery(client, query, [id], 'updateAwardFilm');
    }

    static async check(institution, year, name) {
        const query = 'SELECT * FROM award WHERE LOWER(institution) = LOWER($1) AND year = $2 AND LOWER(name) = LOWER($3)';
        const result = await QueryOptimizer.executeQuery(pool, query, [institution, year, name], 'checkAward');
        return result[0];
    }

    static async checkId(id) {
        const query = 'SELECT * FROM award WHERE id_award = $1';
        const result = await QueryOptimizer.executeQuery(pool, query, [id], 'checkIdAward');
        return result[0];
    }
}

module.exports = Award;