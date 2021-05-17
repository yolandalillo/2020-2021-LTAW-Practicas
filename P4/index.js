const electron = require('electron');
const ip = require('ip');

//-- Obtener elementos de la interfaz
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const info4 = document.getElementById("info4");
const directorio = document.getElementById("info5");
const arquitectura = document.getElementById("info6");
const plataforma = document.getElementById("info7");
const usuarios = document.getElementById("usuarios");
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");

//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
//-- Versión de Node
info1.textContent = process.versions.node;
//-- Versión de Chrome
info2.textContent = process.versions.chrome;
//-- Versión electron
info3.textContent = process.versions.electron;
//-- Arquitectura
arquitectura.textContent = process.arch;
//-- Plataforma
plataforma.textContent = process.platform;
//-- Directorio
directorio.textContent = process.cwd();
//-- Inicializar contador usuarios
usuarios.innerHTML = 0;

btn_test.onclick = () => {
    console.log("Botón ON!");
    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "Probando, probando.... !!");
}

//-- Mensaje recibido del proceso MAIN para la ip
electron.ipcRenderer.on('ip', (event, message) => {
    console.log("Recibida Ip: " + message);
    info4.innerHTML = message;
    //-- Generar el codigo qr de la url
});

//-- Mensaje recibido del proceso MAIN para el numero de usuarios
electron.ipcRenderer.on('usuarios', (event, message) => {
    console.log("Recibido numero de usuarios: " + message);
    usuarios.innerHTML = message;
});

//-- Mensaje recibido del proceso MAIN de los usuarios
electron.ipcRenderer.on('msg', (event, message) => {
    console.log("Recibido numero de usuarios: " + message);
    display.innerHTML += message + "<br>";
    display.scrollTop = display.scrollHeight;
});