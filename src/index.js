const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');
const users = require('./data/users.json');
const Database = require('better-sqlite3');
const { json } = require('express');
// let users;

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

//set template engine middle middlewares
server.set('view engine', 'ejs');

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

const staticServerPathWeb = './src/public-react'; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWeb));

const staticServerPathWeb2 = './src/public-movies-images'; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWeb2));

const db = new Database('./src/database.db', {
  verbose: console.log,
});

server.get('/movies', (req, res) => {
  // preparamos la query
  const query = db.prepare('SELECT * FROM movies');
  // ejecutamos la query
  const movies = query.all();
  // respondemos a la petición con los datos que ha devuelto la base de datos
  console.log(movies);
  res.json(movies);
});

server.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const isIn = users.find((user) => {
    return user.email === email && user.password === password;
  });
  if (isIn) {
    const response = {
      success: true,
      userId: 'id_de_la_usuaria_encontrada',
    };
    res.json(response);
  } else {
    const response = {
      success: false,
      errorMessage: 'Usuaria/o no encontrado',
    };
    res.json(response);
  }
});

server.get('/movie/:movieId', (req, res) => {
  const movie = movies.movies.find((movie) => movie.id === req.params.movieId);
  console.log('movie :', movie);
  //req.params.movieId;
  console.log(movies);

  // response with rendered template
  if (movie) {
    // ensure data
    movie.title = movie.title || '';
    movie.year = movie.year || '';
    movie.director = movie.director || '';
    movie.country = movie.country || '';
    res.render('movie', movie);
  } else {
    res.render('movie');
  }
});

server.post('/sign-up', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const queryIsIn = db.prepare('SELECT * FROM users WHERE email = ?');
  const resultIsIn = queryIsIn.get(email);

  if (resultIsIn !== undefined) {
    const response = {
      success: false,
      errorMessage: 'Usuario ya existente',
    };
    res.json(response);
  } else {
    const query = db.prepare(
      'INSERT INTO users (email, password) VALUES (?, ?)'
    );
    const result = query.run(email, password);
    const response = {
      success: true,
      userId: result.lastInsertRowid,
    };
    res.json(response);
  }
});

server.get('/user/movie', (req, res) => {
  const response = {};
  const email = req.params.email;
  const password = req.params.password;
  const queryUserId = db.prepare('SELECT id FROM users WHERE email = ?');
  const userId = queryUserId.get(email);

  const query = db.prepare(
    'SELECT * FROM users, movies, rel_movies_users WHERE users.id = rel_movies_users.userId AND movies.id = rel_movies_users.movieId and users.id = ?'
  );
  const result = query.get(userId);
  response.success = true;
  response.movies = [];
  console.log(response);
  res.json(response);
});
