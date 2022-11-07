// import { PasajeroRegistrado } from './checking.js'
class PasajeroRegistrado {
    constructor(nombre, dni, asiento) {
        this.nombre = nombre;
        this.dni = dni;
        this.asiento = asiento;
    }
}
(() => {
    // recoge la informacion del localStorage de los asientos ya ocupados en el vuelo en el que se va a registrar
    let ocupados = JSON.parse(localStorage.asientosOcupados);
    ocupados.forEach(element => {
        document.getElementById(element).disabled = true;// 
    });
})();
// captura la id del asiento. No se porque no funciona bootstrap aqui, deberîa de cambiar el boton cuando se selecciona, 
// pero no lo hace
let btns = document.querySelectorAll('button');
let asiento = "";
for (i of btns) {
    i.addEventListener('click', function () {
        asiento = this.id;
        return asiento;
    });
}
let pasajEnVuelo = JSON.parse(localStorage.getItem("checkdInVuelo"));
// Aqui tenia un problema y es que habrîa que actualizar los asientos ocupados y disponibles de los vuelos, pero no podia
// utilizar el array de vuelos pq los genera nuevos con id del 1 al 100 cuando se inicializa, por lo que los anteriores
// desaparecen y por eso tenia que cargar los datos del vuelo de prueba.
function confirmarAsiento() {
    pasajEnVuelo[0].pasajero[0].asiento = asiento;
    localStorage.setItem("checkdInVuelo", JSON.stringify(pasajEnVuelo));
    vuelosConRegistro();
    window.location = './checking-realizado.html'
}
//  Creamos un nuevo storage con los datos de los vuelos con pasajeros que ya se han registrado 
// Podria haber utilizado vuelosRegistro para almacenar tb los asientos disponibles y asientos ocupados
// y coger este dato de esta key en vez de cargarlo en Compras
let vuelo = pasajEnVuelo[0].idVuelo // checkdInVuelo solo puede tener un vuelo, que es el que se está registrando
function vuelosConRegistro() {
    let vuelosPasReg = JSON.parse(localStorage.getItem("vuelosRegistro"));
    if (!vuelosPasReg) {
        localStorage.setItem("vuelosRegistro", JSON.stringify(pasajEnVuelo));
    } else {
        let vueloExiste = vuelosPasReg.findIndex(element => (element.idVuelo == vuelo));
        if (vueloExiste != -1) {
            let pasajerosYa = vuelosPasReg[vueloExiste].pasajeros;
            let nuevoPasajero = pasajEnVuelo[0].pasajero[0]; // Tiene los datos del checking, por lo que son unicos
            pasajerosYa.push(nuevoPasajero);
            vuelosPasReg[vueloExiste].pasajeros = pasajerosYa;
            localStorage.setItem("vuelosRegistro", JSON.stringify(vuelosPasReg));
        } else {
            vuelosPasReg.push(pasajEnVuelo[0]);
            localStorage.setItem("vuelosRegistro", JSON.stringify(vuelosPasReg));
        }
    }
}