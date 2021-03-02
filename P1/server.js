const http = require('http');
const url = require('url');
const fs = require('fs');

const PUERTO = 8080

const server = http.createServer((req,ser) => {
    console.log("Petición recibida");

})

server.listen(PUERTO);

console.log("Servidor escuchando en " + PUERTO)