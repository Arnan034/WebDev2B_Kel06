const express = require('express');
const bcrypt = require('bcrypt');
const SECRET_KEY = 'my_default_secret_key';
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL pool setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Film',
  password: 'admin',
  port: 5432,
});

// COUNTRIES CRUD

// Create country
app.post('/country', async (req, res) => {
    console.log("Received data:", req.body);  // Debug data yang diterima
    const { country_name } = req.body;  // Ambil country_name

    if (!country_name) {
        return res.status(400).json({ error: "Country name is required" });
    }

    try {
        const newCountryEntry = await pool.query(
            'INSERT INTO country (country_name) VALUES ($1) RETURNING *',
            [country_name]  // Pastikan menggunakan country_name
        );
        res.json(newCountryEntry.rows[0]);          
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to insert country' });
    }
});

// Get all countries
app.get('/country', async (req, res) => {
  try {
    const allCountry = await pool.query('SELECT * FROM country');
    res.json(allCountry.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

app.post('/genre', async (req, res) => {
  console.log("Received data:", req.body);  // Debug data yang diterima
  const { genre } = req.body;  // Ambil country_name

  if (!genre) {
      return res.status(400).json({ error: "Country name is required" });
  }

  try {
      const newCountryEntry = await pool.query(
          'INSERT INTO genre (genre) VALUES ($1) RETURNING *',
          [genre]  // Pastikan menggunakan country_name
      );
      res.json(newCountryEntry.rows[0]);          
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to insert country' });
  }
});

// Show all movies
app.get('/showmovies', async (req, res) => {
  const { country } = req.query;
  try {
    let query = `
      SELECT fa.id_film AS id, fa.title, fa.picture, fa.year, fa.status, fa.rate, fa.views, fa.date_upload AS date, ARRAY_AGG(g.genre) AS genres
      FROM film_approve fa
      LEFT JOIN genre_film gf ON fa.id_film = gf.id_film
      LEFT JOIN genre g ON gf.id_genre = g.id_genre
    `;

    // Using a parameterized query to prevent SQL injection
    const params = [];
    if (country) {
      query += ` WHERE fa.id_country = $1`;
      params.push(country);
    }

    query += ` GROUP BY fa.id_film ORDER BY fa.id_film ASC;`;

    const moviesResult = await pool.query(query, params);

    // Convert image to base64
    const movies = moviesResult.rows.map(movie => ({
      id: movie.id,
      title: movie.title,
      picture: movie.picture ? movie.picture.toString('base64') : null, // Check for null/undefined
      year: movie.year,
      status: movie.status,
      rate: movie.rate,
      views: movie.views,
      genres: movie.genres,
      date: movie.date_upload
    }));

    res.json(movies); // Return array of movies
  } catch (err) {
    console.error('Error fetching movies:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/search', async (req, res) => {
  const { country, search } = req.query;
  try {
    let query = `
      SELECT fa.id_film AS id, fa.title, fa.picture, fa.year, fa.status, fa.rate, fa.views, fa.date_upload AS date, ARRAY_AGG(g.genre) AS genres
      FROM film_approve fa
      LEFT JOIN genre_film gf ON fa.id_film = gf.id_film
      LEFT JOIN genre g ON gf.id_genre = g.id_genre
    `;

    const params = [];
    if (country || search) {
      query += ` WHERE `;
      if (country && search) {
        query += `fa.id_country = $1 AND LOWER(fa.title) LIKE '%' || $2 || '%'`;
        params.push(country, search.toLowerCase());
      } else if (country) {
        query += `fa.id_country = $1`;
        params.push(country);
      } else if (search) {
        query += `LOWER(fa.title) LIKE '%' || $1 || '%'`;
        params.push(search.toLowerCase());
      }
    }

    query += ` GROUP BY fa.id_film ORDER BY fa.id_film ASC;`;

    const moviesResult = await pool.query(query, params);

    const movies = moviesResult.rows.map(movie => ({
      id: movie.id,
      title: movie.title,
      picture: movie.picture ? movie.picture.toString('base64') : null,
      year: movie.year,
      status: movie.status,
      rate: movie.rate,
      views: movie.views,
      genres: movie.genres,
      date: movie.date_upload
    }));

    res.json(movies);
  } catch (err) {
    console.error('Error fetching movies:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});



//Detail Films
app.get('/movie/:id', async (req, res) => {
  const { id } = req.params; // Mengambil id dari URL params

  try {
      const query = `
          SELECT 
              fa.id_film AS id, 
              fa.title, 
              fa.picture, 
              fa.alternative_title, 
              fa.year, 
              fa.sysnopsis, 
              fa.link_trailer AS trailer, 
              fa.availability, 
              fa.status, 
              ARRAY_AGG(DISTINCT g.genre) AS genres,
              (
                  SELECT 
                      JSON_AGG(award_info)
                  FROM (
                      SELECT DISTINCT 
                          aw.year_award, 
                          aw.institution, 
                          aw.award
                      FROM 
                          award aw
                      WHERE 
                          aw.id_film = fa.id_film
                  ) AS award_info
              ) AS awards
          FROM 
              film_approve fa
          LEFT JOIN 
              genre_film gf ON fa.id_film = gf.id_film
          LEFT JOIN 
              genre g ON gf.id_genre = g.id_genre
          WHERE 
              fa.id_film = $1 -- Use parameterized query for safety
          GROUP BY 
              fa.id_film;

      `;
      const result = await pool.query(query, [id]); // Menggunakan id dari URL params

      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Movie not found' });
      }

      const movie = result.rows[0];

      res.json({
          id: movie.id,
          title: movie.title,
          picture: movie.picture.toString('base64'),
          alternative_title: movie.alternative_title,
          year: movie.year,
          sysnopsis: movie.sysnopsis,
          trailer: movie.trailer,
          availability: movie.availability,
          genres: movie.genres,
          status: movie.status,
          awards: movie.awards
      });
  } catch (error) {
      console.error('Error fetching movie details:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Comment
app.get('/comment/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        c.id_film, 
        c.comment, 
        c.rating, 
        c.date, 
        u.username
      FROM comment AS c
      RIGHT JOIN users AS u ON c.id_user = u.id_user
      WHERE c.id_film = $1 AND c.posted = TRUE
    `;
    
    const result =  await pool.query(query, [id]);

    const comments = result.rows.map(comment => ({
      id_film: comment.id_film,
      comment: comment.comment,
      rate: comment.rating,
      date: comment.date,
      user: comment.username
    }));

    res.json(comments); // Return the filtered comments
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// actor
app.get('/actors/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT a.actor_name AS name, a.picture
      FROM actor_film AS af
      LEFT JOIN actor AS a ON a.id_actor = af.id_actor
      WHERE af.id_film = $1
    `;
    
    const result =  await pool.query(query, [id]);

    const actors = result.rows.map(actor => ({
      name: actor.name,
      picture: actor.picture.toString('base64')
    }));

    res.json(actors); // Return the filtered comments
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userQuery = `
      SELECT * 
      FROM users 
      WHERE username = $1;
    `;

    const result = await pool.query(userQuery, [username]);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Bandingkan password hash yang disimpan dengan password yang diinput
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        // Buat JWT token menggunakan default secret key
        const token = jwt.sign({ id: user.id_user, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        // Kirim id_user dan token ke client
        res.json({ token, id_user: user.id_user });
      } else {
        // Jika password tidak cocok
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      // Jika user tidak ditemukan
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
