//-- Importamos los módulos
const http = require('http');
const url = require('url');
const fs = require('fs');

//-- Puerto que vamos a utilizar
const PUERTO = 8080;

//-- Mensaje 
console.log("Arrancando servidor...");

//-- Nombre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- Creamos el servidor 
const server = http.createServer((req, res) => {
    //-- Construimos url con la url de solicitud
    const myURL = new URL(req.url, 'http://' + req.headers['host']);  


