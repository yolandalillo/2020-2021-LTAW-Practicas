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
    productos_disponibles.push([element.nombre, element.descripcion, element.stock, element.precio]);
    lista_producto.push(element.nombre);
});
console.log();

//-- Análisis cookie
//-- Obtener usuario
function get_usuario(req){
    //-- Leer cookie
    const cookie = req.headers.cookie;
    //-- Si hay cookie
    if (cookie){
        //-- Guardamos el usuario
        //-- Obtenemos array con nombre-valor
        let pares = cookie.split(";");
        //-- Aquí guardamos los usuarios
        let usuario;

        //-- Recorremos el array
        pares.forEach((element,index) => {
            //-- Valor de los pares por separado
            let[nombre,valor] = element.split("=");
            //-- Nombre = Usuario
            if(nombre.trim() === 'usuario'){
                usuario = valor;
            }
        });
        //-- Usuario no asignado a cookie
        return usuario || null;
    }
}

//-- Crear cookie cuando añadimos producto al carro
function add_carrito (req, res, producto){
    //-- Leer cookie
    const cookie = req.headers.cookie;
    //-- Si hay cookie
    if (cookie){
        //-- Obtenemos array con nombre-valor
       let pares = cookie.split(";");
        //-- Recorremos el array
        pares.forEach((element,index) => {
            //-- Valor de los pares por separado
            let[nombre,valor] = element.split("=");
            //-- Nombre = Carrito
            if(nombre.trim() === 'carrito'){
                res.setHeader('Set-Cookie', element + ':' + producto);
            }

        });
    }
}

function get_carrito(req){
    //-- Leer cookie
    const cookie = req.headers.cookie;
    //-- Si hay cookie
    if (cookie){
        //-- Obtenemos array con nombre-valor
        let pares = cookie.split(";");  
        //-- Variable para datos del carro
        let carrito;
        let ramo = '';
        let numero_ramos = 0;
        let planta = '';
        let numero_plantas = 0;
        let flor = '';
        let numero_flores = 0;
        let terrario = '';   
        let numero_terrarios = 0;
        pares.forEach((element,index) => {
            //-- Valor de los pares por separado
            let[nombre,valor] = element.split("=");
            //-- Nombre = Carrito
            if(nombre.trim() === 'carrito'){
                productos = valor.split(':');
                productos.forEach((producto) => {
                    if(producto = 'ramo'){
                        if(numero_ramos == 0){
                            ramo = productos_disponibles[0][0];
                        }
                        numero_ramos +=1;
                    }else if (producto = 'planta') {
                        if(numero_plantas == 0){
                            planta = productos_disponibles[1][0];
                        }
                        numero_plantas +=1;
                    }else if (producto = 'flor'){
                        if(numero_flores == 0){
                            flor = productos_disponibles[2][0]
                        }
                        numero_flores +=1
                    }else if (producto = 'terrario'){
                        if(numero_terrarios == 0){
                            terrario = productos_disponibles[3][0];
                        }
                        numero_terrarios +=1

                    }
                });
                if (numero_ramos !=0){
                    ramo += 'x' + numero_ramos;
                }
                if (numero_plantas !=0){
                    planta += 'x' + numero_plantas;
                }
                if(numero_flores !=0){
                    flor += 'x' + numero_flores;
                }
                if(numero_terrarios !=0){
                    terrario += 'x' + numero_terrarios;
                }
                carrito = ramo + '<br>' + planta + '<br>' + flor + '<br>' + terrario;
            }
        });
        //-- Carrito vacío
        return carrito || null; 
    }
}

var n;
//-- Obtener la pagina del producto
function get_producto(n, content) {
  content = content.replace('NOMBRE', productos_disponibles[n][0]);
  content = content.replace('DESCRIPCION', productos_disponibles[n][1]);
  content = content.replace('PRECIO', productos_disponibles[n][3]);

  return content;
}

//-- Creamos el servidor
const server = http.createServer((req,res) => {
    
});

server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);