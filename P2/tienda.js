//-- Importamos los módulos
const http = require('http');
const url = require('url');
const fs = require('fs');

//-- Puerto
const PUERTO = 8080;

//-- Página principal de la web
const PRINCIPAL = fs.readFileSync('principal.html', 'utf-8');

//-- Registro -> Fichero JSON
const FICHERO_JSON = "tienda.json";

//-- Página web del formulario login
const FORMULARIO = fs.readFileSync('form.html','utf-8');

//-- Páginas de respuesta (HACER)
//-- Login ON
//-- Login OFF


//-- Estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Usuarios registrados.
let usuarios_registrados = [];
console.log("Lista de los usuarios registrados");

tienda[1]["usuarios"].forEach((element, index)=>{
    console.log("Usuario " + (index + 1) + ": " + element.usuario);
    usuarios_registrados.push(element.usuario);
});

console.log();

//-- Creamos el servidor



server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);