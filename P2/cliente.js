console.log("Ejecutando Javascript...");

const display1 = document.getElementById("display1");

//-- Caja de busqueda
const caja = document.getElementById("caja");

//-- Función de retrollamada
caja.oninput = () => {




    //-- La peticion se realia solo si hay al menos 1 carácter
    if (caja.value.length >= 1) {
        //-- Configurar la petición
        m.open("GET","/productos?param1=" + caja.value, true);
        //-- Enviar la petición!
        m.send();
    } else {
          display1.innerHTML="";
    }

}

