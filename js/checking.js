// export { PasajeroRegistrado }; Al importar/exportar me daba un error que 
// decia que se habia encontrado inesperadamente un export, aun habiendo declarado
//  en los correspiendientes js y llamado al modulo en el html

class PasajeroRegistrado {
    constructor(nombre, dni, asiento) {
        this.nombre = nombre;
        this.dni = dni;
        this.asiento = asiento;
    } // Objeto que guardará los datos de la persona que esta haciendo checkin en CheckdInVuelo
}
class CheckdInVuelo {
    constructor(idVuelo, pasajero) {
        this.idVuelo = idVuelo;
        this.pasajero = pasajero;
    }
}   // Objeto que guardará los datos de los vuelos con usuarios ya registrados
class Compra {
    constructor(numReserva, fechaReserva, usuario, numPasajes, vuelo) {
        this.numReserva = numReserva;
        this.fechaReserva = fechaReserva;
        this.usuario = usuario;
        this.numPasajes = numPasajes;
        this.vuelo = vuelo;
    }
}
let datosCompras = JSON.parse(localStorage.compras);
let datosCheckin = JSON.parse(localStorage.checkinUser);
let pos1 = datosCheckin[0];
let pos2 = datosCheckin[2];
(() => {
    imprimirDatosPasajero(pos1, pos2);
})();
function imprimirDatosPasajero(pos1, pos2) {
    let nomPasajero = document.getElementById("nombre");
    let apePasajero = document.getElementById('apellidos');
    let dniPasajero = document.getElementById('dni');
    nomPasajero.value = datosCompras[pos1].numPasajes[pos2].nombre;
    apePasajero.value = datosCompras[pos1].numPasajes[pos2].Apellidos;
    dniPasajero.value = datosCompras[pos1].numPasajes[pos2].dni;
}
function checkNomApe(name) {
    let regExpNom = /(^[A-ZÁÉÍÓÚ]{1}([a-zñáéíóú]+){2,})(\s[A-ZÁÉÍÓÚ]{1}([a-zñáéíóú]+){2,})?$/;
    let check = document.getElementById(name).value;
    if (!regExpNom.test(check)) {
        alert('Por favor introduce tus datos correctamente');
        document.getElementById(name).style.outline = "#ff000087 solid";
        return false;
    } else {
        return true;
    }
}

function checkDni() { // Valida Dni o NIE}
    let regExpDNI = /^[XYZ]?\d{5,8}[A-Z]$/;
    let dni = document.getElementById("dni").value;
    let numero;
    let letr;
    let letra;
    if (regExpDNI.test(dni) == true) {
        numero = dni.substr(0, dni.length - 1);
        numero = numero.replace('X', 0);
        numero = numero.replace('Y', 1);
        numero = numero.replace('Z', 2);
        letr = dni.substr(dni.length - 1, 1);
        numero = numero % 23;
        letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
        letra = letra.substring(numero, numero + 1);
        if (letra != letr.toUpperCase()) {
            document.getElementById("dni").style.outline = "#ff000087 solid";
            alert('Dni erroneo, la letra del NIF no se corresponde');
            return false;
        } else {
            return true;
        }
    } else {
        document.getElementById("dni").style.outline = "#ff000087 solid";
        alert('Por favor introduce un DNI correcto');
        return false;
    }
}
function checkEmail() { // Valida Email
    let regExpEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    let email = document.getElementById("email").value;
    if (!regExpEmail.test(email)) {
        document.getElementById("email").style.outline = "#ff000087 solid";
        alert('Por favor introduce un email correcto');
        return false;
    } else {
        return true;
    }
}

function checkTel() { // Valida Telefono
    let regExpTel = /^(?:(?:\+?[0-9]{2,4})?[ ]?[6789][0-9 ]{8,13})$/;
    let tel = document.getElementById("telefono").value;
    if (!regExpTel.test(tel)) {
        document.getElementById("telefono").style.outline = "#ff000087 solid";
        alert('Por favor, introduce un teléfono correcto');
        return false;
    } else {
        return true;
    }
}
// comprobamos que no haya hecho checking antes en este vuelo
function checkinAnterior() {
    let vuelo = datosCompras[pos1].vuelo[0].id; // En cada reserva solo hay un vuelo, por lo tanto posicion 0
    let dniPasajero = document.getElementById('dni');
    let vuelosPasReg = JSON.parse(localStorage.getItem("vuelosRegistro"));
    if (vuelosPasReg) {
        let clave = vuelosPasReg.findIndex(element => (element.idVuelo == vuelo));
        let clave2 = vuelosPasReg[clave].pasajero.findIndex(element => (element.dni === dniPasajero.value));
        if (clave2 != -1) {
            alert('Este pasajero ya esta registrado en este vuelo');
            return false;
        }
    }
    return true;
}
function confirmacion() {
    // Validaciones
    if (checkNomApe('nombre') &&
        checkNomApe('apellidos') &&
        checkDni() &&
        checkEmail() &&
        checkTel() && checkinAnterior()) {
        // Recopilamos los datos confirmados por el pasajero y los subimos al Storage
        let nomPasajero = document.getElementById("nombre");
        let apePasajero = document.getElementById('apellidos');
        let dniPasajero = document.getElementById('dni');
        let vuelo = datosCompras[pos1].vuelo[0].id; // En cada reserva solo hay un vuelo, por lo tanto posicion 0
        let nombreCompleto = nomPasajero.value + " " + apePasajero.value;
        let asiento = "";
        let dataPasajero = [new PasajeroRegistrado(nombreCompleto, dniPasajero.value, asiento)];
        let asientosOcupados = datosCompras[pos1].vuelo[0].asientosOcupados  // En cada reserva solo hay un vuelo, por lo tanto posicion 0
        let data = []
        let v1 = new CheckdInVuelo(vuelo, dataPasajero);
        data.push(v1)
        localStorage.setItem("checkdInVuelo", JSON.stringify(data)); // subimos los datos de registro de este usuario
        localStorage.setItem("asientosOcupados", JSON.stringify(asientosOcupados)) // Subimos los asientos ocupados para deshabilitar los mismos
        window.location = './asientos.html'
    }
}