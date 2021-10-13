const express = require('express');
const cors = require('cors');
const data = require('./data/movies.json');
const users = require('./data/users.json');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

const staticServerPathWeb = "./src/public-react"; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWeb));

server.get('/movies', (req, res) => {
  if (!data) {
    res.sendStatus('Error 404');
  }
  else {
    res.json(data);
  }
})

const staticServerPathWeb2 = "./src/public-movies-images"; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWeb2));

server.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const isIn = users.find((user) => {
    return user.email === email && user.password === password;
  })
  if (isIn) {
    const response = {
      "success": true,
      "userId": "id_de_la_usuaria_encontrada"
    }
    res.json(response);
  }
  else {
    const response = {
      "success": false,
      "errorMessage": "Usuaria/o no encontrado"
    }
    res.json(response);
  }

})