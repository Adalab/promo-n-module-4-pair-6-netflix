const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');
const users = require('./data/users.json');
const Database = require('better-sqlite3');
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
  verbose: console.log
});

server.get('/movies', (req, res) => {
  // if (!movies) {
  //   res.sendStatus('Error 404');
  // } else {
  //   res.json(movies);
  // }
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
    res.render('views/movie', movie);
  } else {
    res.render('views/movie');
  }

  // if (movie === undefined) {
  //   res.json({ error: 'movie-not-found' });
  // } else {
  //   res.json(movie);
  // }
});

server.post('/sign-up', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const queryIsIn = db.prepare('SELECT * FROM users WHERE email = ?');
  const resultIsIn = queryIsIn.all(email)
  if (resultIsIn !== undefined) {
    const response = {
      success: false,
      errorMessage: 'Usuario ya existente',
    };
    res.json(response);
  } else {
    const query = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    const result = query.run(req.body.email, req.body.password);
    const response = {
      success: true,
      userId: lastInsertRowid,
    };
    res.json(response);
  }
})