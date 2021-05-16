const electron = require('electron');
const ip = require('ip');
const qr = require('qrcode')

//-- Obtener elementos de la interfaz
//const btn_test = document.getElementById("btn_test");
//const display = document.getElementById("display");
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const info4 = document.getElementById("info4");
const usuarios = document.getElementById("usuarios");
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");
const qrc = document.getElementById("qrc");

//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
info1.textContent = process.versions.node;
info2.textContent = process.versions.chrome;
info3.textContent = process.versions.electron;
usuarios.innerHTML = 0;

//-- código QR
const src = 'http://' + ip.address() + ':' + '8080';
qr.toDataURL(src, function (err, url) {
    qrc.src = url;
});

btn_test.onclick = () => {
    console.log("Botón ON!");

    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "Probando, probando.... !!");
}

//-- Mensaje recibido del proceso MAIN para la ip
electron.ipcRenderer.on('ip', (event, message) => {
    console.log("Recibida Ip: " + message);
    info4.innerHTML = message;
});

//-- Mensaje recibido del proceso MAIN para el numero de users
electron.ipcRenderer.on('list', (event, message) => {
    console.log("Recibido numero de usuarios: " + message);
    usuarios.innerHTML = message;
});

//-- Mensaje recibido del proceso MAIN de los usuarios
electron.ipcRenderer.on('msg', (event, message) => {
    console.log("Recibido numero de usuarios: " + message);
    display.innerHTML += message + "<br>";
    display.scrollTop = display.scrollHeight;
});