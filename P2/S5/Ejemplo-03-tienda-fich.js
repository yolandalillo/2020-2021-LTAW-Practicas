//-- Crear una variable con la estructura definida
//-- en un fichero JSON

const fs = require('fs');

//-- Nombre del fichero JSON que queremos leer
const FICHERO_JSON = "Ej-03-tienda-json-fich.json"

//-- Leemos el fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Mostrar informacion sobre la tienda
console.log("Productos en la tienda: " + tienda.length);

//-- Recorrer el array de productos
tienda.forEach((element, index)=>{
  console.log("Producto: " + (index + 1) + ": " + element["nombre"]);
});