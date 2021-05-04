//-- Cargar las dependencias
const express = require('express')
const app = express()
const http = require('http').Server(app);
//-- Biblioteca socket.io en el lado del servidor
const io = require('socket.io')(http);

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

//-- Lanzar servidor
http.listen(PUERTO, function(){
  console.log('Servidor lanzado en puerto ' + PUERTO);
});

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  let path = __dirname + '/chat.html';
  res.sendFile(path);
  console.log("Acceso a " + path);
});

//-- Otra vista de prueba
app.get('/hola', (req, res) => {
  res.send('HOLA AMIGO! El inicio de tu sesión está aprobado!! :-)');
  console.log("Acceso a /hola");
});

//-- El resto de peticiones se interpretan como
//-- ficheros estáticos
app.use('/', express.static(__dirname +'/'));

//------ COMUNICACION POR WEBSOCKETS
//-- Evento: Nueva conexion recibida
//-- Un nuevo cliente se ha conectado!
io.on('connection', function(socket){

  //<<<<< Sumamos uno al contador >>>>>
  cont_usu += 1;

  //-- Usuario conectado. Imprimir el identificador de su socket
  console.log('--> Usuario conectado!. Socket id: ' + socket.id);

  //-- Le damos la bienvenida a través del evento 'hello'
  //-- ESte evento lo hemos creado nosotros para nuestro chat
  socket.emit('Hola!! :)', "Bienvenido al Chat de Yolanda. Eres el usuario numero:" + cont_usu);

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