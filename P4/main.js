//-- Cargar el módulo de electron
const electron = require('electron');
//-- Cargar dependencias
const http = require('http');
const express = require('express');
const colors = require('colors');
const socket = require('socket.io');
const fs = require('fs');
const ip = require('ip');
//-- Crear una nueva aplciacion web
const app = express();

//-- Servidor, asociado a la App de express
const server = http.Server(app);

//-- Servidor sociado al servidor http
const io = socket(server);

//-- Contador de usuarios
let cont_usu = 0;

//-- Puerto donde lanzar el servidor
const PUERTO = 8080

//-- Función mostrar la fecha y hora
function hoyFecha(){
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1;
    var yyyy = hoy.getFullYear();
    var h = hoy.getHours();
    var m = hoy.getMinutes();
    var s = hoy.getSeconds();
    return dd+'/'+mm+'/'+yyyy+' --> '+ h+':'+m+':'+s;
}

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;
//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
    let path = __dirname + '/index.html';
    res.sendFile(path);
    console.log("Acceso a " + path);
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));
//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

io.on('connection', function(socket){
    //-- Sumamos uno al contador 
    cont_usu += 1;
    
  //-- Usuario conectado. Imprimir el identificador de su socket
  console.log('--> Usuario conectado!. Socket id: ' + socket.id);

  //-- Le damos la bienvenida a través del evento 'hello'
  //-- ESte evento lo hemos creado nosotros para nuestro chat
  socket.emit('hello', "Bienvenido al Chat de Yolanda :) Eres el usuario numero: " + cont_usu);

  //-- Función de retrollamada de mensaje recibido del cliente
  socket.on('msg', (msg) => {
    console.log("Cliente: " + socket.id + ': ' + msg);

    //-- Enviar el mensaje a TODOS los clientes que estén conectados
    io.emit('msg', msg);
  })

  socket.on('cmd', (msg) => {
    console.log("Cliente: " + socket.id + ': ' + msg);

    if(msg =='/help'){
      socket.emit('cmd', " Comandos posibles: /help , /list, /hello, /date ");
    }else if (msg =='/list') {
      socket.emit('cmd', " Tenemos " + cont_usu + " usuarios conectados en el chat " );
    }else if (msg =='/hello') {
      socket.emit('cmd', "Hola compañero, espero que todo te vaya genial :)");
    }else if (msg =='/date') {
        socket.emit('cmd', 'Hoy es: ' + hoyFecha());
    }else {
      socket.emit('cmd', " Comando Erroneo: ejecute /help para ver los comandos permitidos ");
    }
  })
  //-- Usuario desconectado. Imprimir el identificador de su socket
  socket.on('disconnect', function(){
    console.log('--> Usuario Desconectado. Socket id: ' + socket.id);
    //<<<<< Restamos uno al contador >>>>>
    cont_usu -= 1;
  });
});






console.log("Arrancando electron...");

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', () => {
    console.log("Evento Ready!");

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 900,   //-- Anchura 
        height: 900,  //-- Altura

        //-- Permitir que la ventana tenga ACCESO AL SISTEMA
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
    });

  //-- En la parte superior se nos ha creado el menu
  //-- por defecto
  //-- Si lo queremos quitar, hay que añadir esta línea
  //win.setMenuBarVisibility(false)
  //-- Cargar interfaz gráfica en HTML
  win.loadFile("index.html");

  //-- Mandar IP
    ip = 'http://' + ip.address() + ':' + PUERTO;
    win.webContents.send('Imprimos la IP', ip);
});


//-- Esperar a recibir los mensajes de botón apretado (Test) del proceso de 
//-- renderizado. Al recibirlos se escribe una cadena en la consola
electron.ipcMain.handle('test', (event, msg) => {
  console.log("-> Mensaje: " + msg);
  //-- Enviar mensaje de prueba
  io.send(msg);
});

//-- Lanzar el servidor HTTP
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);