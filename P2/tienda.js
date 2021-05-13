//-- Importamos los módulos
const http = require('http');
const fs = require('fs');
//-- Puerto
const PUERTO = 8080;
//-- Página principal de la web
const PRINCIPAL = fs.readFileSync('principal.html', 'utf-8');
//-- Cargar página de error
const ERROR_PAGE = fs.readFileSync('error.html','utf-8');
//-- Cargar las paginas de los productos
const PRODUCTO1 = fs.readFileSync('producto1.html', 'utf-8');
const PRODUCTO2 = fs.readFileSync('producto2.html', 'utf-8');
const PRODUCTO3 = fs.readFileSync('producto3.html', 'utf-8');
const PRODUCTO4 = fs.readFileSync('producto4.html', 'utf-8');
//-- Cargar la pagina del carrito
const CARRITO = fs.readFileSync('carrito.html','utf-8');
//-- Cargar pagina web del formulario login
const FORMULARIO_LOGIN = fs.readFileSync('form-login.html','utf-8');
const FORMULARIO_PEDIDO = fs.readFileSync('form-pedido.html','utf-8');
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
const FICHERO_JSON_PRUEBA = "tienda_prueba.json";

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
    //-- Construir el objeto url con la url de la solicitud
    const myURL = new URL(req.url, 'http://' + req.headers['host']);  
    console.log("");
    console.log("Método: " + req.method);
    console.log("Recurso: " + req.url);
    console.log("Ruta: " + myURL.pathname);
    console.log("Parametros: " + myURL.searchParams);
    //-- Mensaje de respuesta
    let content_type = mime_type["html"];
    let content = "";

    //-- Eliminar la / inicial
    let recurso = myURL.pathname;
    recurso = recurso.substr(1); 

    switch(recurso){
        case '':
            console.log("Página principal")
            //-- Por defecto: inicio
            content = PRINCIPAL;
            //-- Usuario que accede
            let usuario = get_usuario(req);
            //-- Si usuario está login
            if (usuario){
                //-- Anadir el nombre del usuario a nuestra tienda
                content = PRINCIPAL.replace("HTML_EXTRA", "<h2>Usuario: " + usuario + "</h2>" +
                `<form action="/carrito" method="get"><input type="submit" value="Carrito"/></form>`);
            }else{
                //-- Ir al formulario Login
                content = PRINCIPAL.replace("HTML_EXTRA", 
                `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
            }
        break;
        //-- Hacemos página para cada producto
        case 'producto1':
            n = 0;
            content =  PRODUCTO1;
            content =  get_producto(n, content);
        break;
        case 'producto2':
            n = 1;
            content = PRODUCTO2;
            content = get_producto(n,content);
        break;
        case 'producto3':
            n = 2;
            content = PRODUCTO3;
            content = get_producto(n,content);
        break;
        case 'producto4':
            n=3;
            content = PRODUCTO4;
            content =  get_producto(n,content);
        break;
        //-- Añadimos productos al carrito

        case 'add_ramo':
            content =  ADD;
            if(carrito_existe){
                add_carrito(req,res,'ramo');
            }else{
                res.setHeader('Set-Cookie', 'carrito=ramo');
                carrito_existe = true;
            }
            usuario_resgistrado = get_usuario(req);
            if (usuario_resgistrado){
                //-- Formulario login
                content = ADD.replace("HTML_EXTRA", 
                `<form action="/carrito" method="get"><input type="submit" value="Ir al Carrito"/></form>`);
            }else{
                content = ADD.replace("HTML_EXTRA", 
                `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
            }
        break;
        case 'add_planta':
            content =  ADD;
            if(carrito_existe){
                add_carrito(req,res,'planta');
            }else{
                res.setHeader('Set-Cookie', 'carrito=ramo');
                carrito_existe = true;
            }
            usuario_resgistrado = get_usuario(req);
            if (usuario_resgistrado){
                //-- Formulario login
                content = ADD.replace("HTML_EXTRA", 
                `<form action="/carrito" method="get"><input type="submit" value="Ir al Carrito"/></form>`);
            }else{
                content = ADD.replace("HTML_EXTRA", 
                `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
            }
        break;
        case 'add_flor':
            content =  ADD;
            if(carrito_existe){
                add_carrito(req,res,'flor');
            }else{
                res.setHeader('Set-Cookie', 'carrito=ramo');
                carrito_existe = true;
            }
            usuario_resgistrado = get_usuario(req);
            if (usuario_resgistrado){
                //-- Formulario login
                content = ADD.replace("HTML_EXTRA", 
                `<form action="/carrito" method="get"><input type="submit" value="Ir al Carrito"/></form>`);
            }else{
                content = ADD.replace("HTML_EXTRA", 
                `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
            }
        break;
        case 'add_terrario':
            content =  ADD;
            if(carrito_existe){
                add_carrito(req,res,'terrario');
            }else{
                res.setHeader('Set-Cookie', 'carrito=ramo');
                carrito_existe = true;
            }
            usuario_resgistrado = get_usuario(req);
            if (usuario_resgistrado){
                //-- Formulario login
                content = ADD.replace("HTML_EXTRA", 
                `<form action="/carrito" method="get"><input type="submit" value="Ir al Carrito"/></form>`);
            }else{
                content = ADD.replace("HTML_EXTRA", 
                `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
            }
        break;

        case 'carrito':
            content = CARRITO;
            let carrito = get_carrito(req);
            content = content.replace('PRODUCTOS', carrito);
        break;
        //-- Formulario login
        case 'login':
            content = FORMULARIO_LOGIN;
        break;
        //-- Respuesta formulario login
        case 'procesarlogin':
            //-- Nombre usuario
            let user = myURL.searchParams.get('nombre');
            console.log('Nombre: ' + user);
            //-- Si está resistrado
            if(usuarios_registrados.includes(user)){
                console.log('El usuario' + user + 'está registrado');
                //-- Asignar cookie
                res.setHeader('Set-Cookie', 'usuario=' + user);
                //-- Asignar página web
                content = LOGIN_OK;
                html_extra = user;
                content = content.replace('HTML_EXTRA', html_extra);
            }else{
                content =  LOGIN_ERROR;
            }
        break;

        //-- Formulario pedido
        case 'pedido':
            content = FORMULARIO_PEDIDO;
            let pedido = get_carrito(req);
            content = content.replace('PRODUCTOS', pedido);
        break;
        //-- Respuesta formulario pedido
        case 'procesarpedido':
            //-- Guardar datos en el JSON
            let direccion = myURL.searchParams.get('direccion');
            let tarjeta = myURL.searchParams.get('tarjeta');
            console.log(" La dirección de envío es: " + direccion + "\n" +
            "El número de la tarjeta: " + tarjeta + "\n");
            //-- Lista de productos y la cantidad
            carro = get_carrito(req);
            unidades_producto = carro.split('<br>');
            console.log(unidades_producto);
            //-- Guardar productos comprados
            let lista_productos = [];
            let lista_unidades = [];
            //-- Guardar productos y actualizar stock
            unidades_producto.forEach((element, index) => {
                let[producto,unidades] = element.split('x');
                lista_productos.push(producto);
                lista_unidades.push(unidades);
            });
            //-- Actualizar stock
            tienda[0]['productos'].forEach((element,index) => {
                console.log("Producto " + (index + 1) + ": " + element.nombre);
                console.log(lista_productos[index]);
                if(element.nombre == lista_productos[index]){
                    element.stock =  element.stock - lista_unidades[index];

                }
            });
            //-- Datos pedido en JSON
            if ((direccion != null) && (tarjeta != null)){
                let pedido = {
                    'usuario': get_usuario(req),
                    'direccion': direccion,
                    'tarjeta': tarjeta,
                    'productos': unidades_producto,
                }
                tienda[2]['pedidos'].push(pedido);
                let myTienda = JSON.stringify(tienda, null, 4);
                fs.writeFileSync(FICHERO_JSON_PRUEBA, myTienda);
            }
            //-- Confirmamos el pedido del usuario
            console.log('Pedido realizado con éxito');
            content = PEDIDO_OK;
        break;
        case 'productos':
            console.log('Pide los productos')
            content_type = mime_type['json'];
            let param1 = myURL.searchParams.get(param1);
 
            param1 = param1.toUpperCase();
            console.log('Parametro:' + param1);
            let result = [];

            for (let prod of lista_productos){
                prodU = prod.toUpperCase();
                if(prodU.startsWith(param1)){
                    result.push(prod);
                }
            }
            busqueda = result;
            content = JSON.stringify(result);
        break;
        
        case 'buscar':
            if(busqueda == 'Ramo'){
                n = 0;
                content = PRODUCTO1;
                content = get_producto(n,content);
            }else if(busqueda == 'Planta'){
                n = 1;
                content = PRODUCTO2;
                content = get_producto(n,content);
            }else if(busqueda == 'Flor'){
                n = 2;
                content = PRODUCTO3;
                content = get_producto(n,content);
            }else if(busqueda == 'Terrario'){
                n = 3;
                content = PRODUCTO4;
                content = get_producto(n,content);
            }
        break;

        case 'cliente.js':
            //-- Leer JS
            console.log('Recurso:' + recurso);
            fs.readFile(recurso, 'utf-8', (err,data) => {
                if(err){
                    console.log('Error: ' + err)
                    return;
                }else{
                    res.setHeader('Content-Type', mime_type["js"]);
                    res.write(data);
                    res.end();                   
                }

            });
            return;
        break;

        default:

            path = myURL.pathname.split('/');
            ext = '';
            if (path.length > 2){
                file = path[path.length-1]
                ext = file.split('.')[1]
                if(path.length == 3){
                    if (path[1].startsWith('producto')){
                        recurso = file
                    }else{
                        recurso = path[1] + '/' + file
                    }
                }else{
                    recurso = path[2] + '/' + file
                }
            }else{
                recurso = myURL.pathname.split('/')[1];
                ext = recurso.split('.')[1]
            }
            fs.readFile(recurso, (err, data) => {
            //-- Controlar si la pagina es no encontrada.
            //-- Devolver pagina de error personalizada, 404 NOT FOUND
                if (err){
                res.writeHead(404, {'Content-Type': content_type});
                res.write(ERROR_PAGE);
                res.end();
                }else{
                    //-- Todo correcto
                    //-- Devolvemos segun el tipo de mime
                    content_type = mime_type[ext];
                    res.setHeader('Content-Type', content_type);
                    res.write(data);
                    res.end();
                } 
            });
        return;
    }
    //-- Si hay datos en el cuerpo
    req.on('data', (cuerpo) => {
        //-- Datos = caracteres
        req.setEncoding('utf8');
        console.log(`Cuerpo (${cuerpo.length} bytes)`)
        console.log(` ${cuerpo}`);
      });
  
      //-- Fin  mensaje de solicitud
      req.on('end', ()=> {
        //-- Respuesta
        res.setHeader('Content-Type', content_type);
        res.write(content);
        res.end()
      });

});

server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);