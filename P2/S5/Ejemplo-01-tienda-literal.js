//-- Creamos variable tienda con dos productos
const tienda = [
    {
        nombre: "Alhambra II",
        descripcion: "Placa con FPGA",
        stock: 3
    },
    {
        nombre: "Icestick",
        stock:4
    },

];
//-- Mostramos la información de la tienda (nº productos)
console.log("Productos disponibles en tienda: " + tienda.length);

//-- Para recorrer el array de productos
tienda.forEach((element, index)=>{
    console.log("Producto: " + (index + 1) + ": " + element.nombre);
  });