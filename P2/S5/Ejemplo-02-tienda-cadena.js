//-- Creamos variable tienda con dos productos
const tienda_json = `[
    {
        "nombre": "Alhambra II",
        "descripcion": "Placa con FPGA ice40HX8K",
        "stock": 3
    },
    {
        "nombre": "Icestick",
        "stock": 10
    }
]`
//-- Crear la estructura tienda a partir de la cadena en json
const tienda = JSON.parse(tienda_json);
//-- Mostramos la información de la tienda (nº productos)
console.log("Productos disponibles en tienda: " + tienda.length);

//-- Para recorrer el array de productos
tienda.forEach((element, index)=>{
    console.log("Producto: " + (index + 1) + ": " + element.nombre);
  });