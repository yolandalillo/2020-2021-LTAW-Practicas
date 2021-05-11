//-- Importamos los módulos
const http = require('http');
const fs = require('fs');

//-- Puerto
const PUERTO = 8080;

//-- Página principal de la web
const PRINCIPAL = fs.readFileSync('principal.html', 'utf-8');

// Cargar página de error
const ERROR_PAGE = fs.readFileSync('error.html','utf-8');

//-- Cargar las paginas de los productos
const PRODUCTO1 = fs.readFileSync('producto1.html', 'utf-8');
const PRODUCTO2 = fs.readFileSync('producto2.html', 'utf-8');
const PRODUCTO3 = fs.readFileSync('producto3.html', 'utf-8');
const PRODUCTO4 = fs.readFileSync('producto4.html', 'utf-8');

//-- Cargar la pagina del Carrito
const CARRITO = fs.readFileSync('carrito.html','utf-8');

//-- Cargar pagina web del formulario login
const FORMULARIO_LOGIN = fs.readFileSync('login.html','utf-8');
const FORMULARIO_PEDIDO = fs.readFileSync('pedido.html','utf-8');

//-- Cargar las paginas de respuesta
const LOGIN_OK = fs.readFileSync('form-login-OK.html','utf-8');
const LOGIN_ERROR = fs.readFileSync('form-login-error.html','utf-8');
const PEDIDO_OK = fs.readFileSync('form-pedido-OK.html','utf-8');
const ADD = fs.readFileSync('form-add.html','utf-8');

//-- Definir los tipos de mime
const mime_type = {
    "html" : "text/html",
    "css"  : "text/css",
    "js"   : "application/javascript",
    "jpg"  : "image/jpg",
    "JPG"  : "image/jpg",
    "jpeg" : "image/jpeg",
    "PNG"  : "image/png",
    "png"  : "image/png",
    "ico"  : "image/x-icon",
    "json" : "application/json",
};

//-- Creamos variable para saber si el carro tiene artículos
let carrito_existe = false;
let busqueda;

//-- Registro -> Fichero JSON
const FICHERO_JSON = "tienda.json";
//-- Leer el fichero JSON (lectura sincrona)
const  tienda_json = fs.readFileSync(FICHERO_JSON);

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

//-- Productos disponibles
let productos_disponibles = [];
let lista_producto = [];
console.log("Lista de los productos disponibles");

tienda[0]["productos"].forEach((element, index)=>{
    console.log("Producto " + (index + 1) + ": " + element.nombre +
    ", Stock: " + element.stock + ", Precio: " + element.precio);
    productos_disp.push([element.nombre, element.descripcion, element.stock, element.precio]);
    product_list.push(element.nombre);
});
console.log();



server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);