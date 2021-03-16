//-- Importamos los módulos
const http = require('http');
const url = require('url');
const fs = require('fs');

//-- Puerto que vamos a utilizar
const PUERTO = 8080

//-- Mensaje 
console.log("Arrancando servidor...");

//-- Creamos servidor
const server = http.createServer((req,res) => {
    //-- Mensaje petición recibida
    console.log("Petición recibida");
    
  //-- Crear el objeto URL del mensaje de solitud (req)
  //-- y coger el recurso (url)
    let myURL = url.parse(req.url, true);

  //-- Ruta de nuestro recurso
    console.log("Recurso recibido: " + myURL.pathname);

  //-- Definir la variable fichero
    let filename = "";
  //-- Obtenemos el fichero correspondiente.
    if(myURL.pathname == '/'){
        //-- Página principal de la tienda
        filename += "/tienda.html"; 
    }else{
        filename += myURL.pathname.substr(1); 
    }
  //-- y quedarse con la extenson
    let ext = filename.split(".")[1];

  //-- Tipo de mime solicitado
    console.log('Tipo de dato pedido: ' + ext);

  //-- Tipos de mime
    const mimeType = {
        "html" : "text/html",
        "css"  : "text/css",
        "jpg"  : "image/jpg",
        "JPG"  : "image/jpg",
        "jpeg" : "image/jpeg",
        "png"  : "image/png",
        "ico"  : "image/x-icon"

    };

    //-- Asignar tipo de mime
    let mime = mimeType[ext];
    console.log("Tipo de mime solicitado: " + mime);
    fs.readFile(filename, function(err, data){
        //-- Página es no encontrada.
        //-- Devolver pagina de error,404 NOT FOUND
        if ((err) || (filename == 'error.html')){
          res.writeHead(404, {'Content-Type': mime});
          console.log("Not found");
        }else{
          //-- Petición con éxito
          res.writeHead(200, {'Content-Type': mime});
          console.log("Petición correcta, 200 OK");
        } 
        //-- Enviar los datos 
        res.write(data);
        res.end();
    })

})

//-- Servidor
server.listen(PUERTO);

//-- Mensaje inicio
console.log("Servidor escuchando en " + PUERTO)