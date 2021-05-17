console.log("Ejecutando cliente JS...");

//-- Obtener los elementos del DOM
const display = document.getElementById("display");
const msg = document.getElementById("msg");
const send = document.getElementById("send");
const cmd = document.getElementById("msg");

//-- Crear un websocket
//-- Establecemos la conexión con el servidor
const socket = io();


//-- Se ha recibido el evento 'hello':
//-- Es el mensaje de bienvenida del servidor
socket.on('hello', (msg) => {

  //-- Mensaje en la consola del navegador
  console.log("Mensaje del servidor: " + msg);
  //-- Párrafo display
  display.innerHTML = msg;
});

//-- Se ha recibido un mensaje
socket.on('msg', (msg) => {
  display.innerHTML += "<br> > " + msg;
});

//-- Cuando recibimos un comando
socket.on('cmd', (msg) => {
  console.log("Mensaje del servidor: " + msg);
  display.innerHTML += "<br> > " + msg;
});


//-- Botón de enviar
send.onclick = () => {

  //-- Se envía el mensaje escrito
  //-- 'msg' son los mensajes de usuario
  //-- Si no hay mensaje, no se envía
  if (msg.value[0] != '/' ){
    socket.emit('msg', msg.value)
    //-- Borramos el mensaje escrito
    msg.value="";

  }else {// Si lo primero que se envía es / es comando y no mensaje 
    socket.emit('cmd', msg.value)
    //-- Borramos el mensaje escrito
    msg.value="";
  }

}