const express = require('express');
const cors = require('cors');
const data = require('./data/movies.json');

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