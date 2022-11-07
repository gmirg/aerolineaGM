class Compra {
    constructor(numReserva, fechaReserva, usuario, numPasajes, vuelo) {
        this.numReserva = numReserva;
        this.fechaReserva = fechaReserva;
        this.usuario = usuario;
        this.numPasajes = numPasajes;
        this.vuelo = vuelo;
    }
    // La aplicacion cargaba datos de usuario de prueba, no guardaba las compras de un mismo usuario
    // no guarda los usuarios, por lo que para probar esta parte es necesario cargas datos de prueba
}

// Esta funcion carga datos de usuario en localStorage para poder usarlos en testeo
(function subirHistorial() {
    let fecha = new Date(); // extraigo la fecha de hoy y le sumo 47 horas 
    let fechaMenos48h = sumar47(fecha);
    let dd = String(fechaMenos48h.getDate()).padStart(2, '0');
    let mm = String(fechaMenos48h.getMonth() + 1).padStart(2, '0');
    let yyyy = fechaMenos48h.getFullYear();
    let horaMenos48h = fechaMenos48h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    fechaMenos48h = yyyy + '/' + mm + '/' + dd;
    let compra1 = new Compra(
        '0001', // Numero de reserva
        '28/10/2022', // Fecha de reserva, aqui el dia de la compra
        'gofthet@gmail.com',  // Aqui el correo del usuario
        [JSON.parse('{"nombre": "Gerardo", "Apellidos": "Mir Garcia", "dni": "52656007Z"}')], // Pasajeros
        [JSON.parse('{"id":"DA000","origen":"Madrid","destino":"Edimburgo","fecha":"","hora":"","horallegada":"10:15","asientosLibres":25,"asientosOcupados":["1A","2A","4C","1DC","2DC"],"precio":120}')]);
    compra1.vuelo[0].fecha = fechaMenos48h;
    compra1.vuelo[0].hora = horaMenos48h;
    // A la primera compra se le asigna una fecha menor de 48h desde el momento de la carga de datos para que 
    // salte la disponibilidad del checking
    let compra2 = new Compra(
        '0002', // Numero de reserva
        '28/10/2022', // Fecha de reserva, aqui el dia de la compra
        'gofthet@gmail.com',  // Aqui el correo del usuario
        [JSON.parse('{"nombre": "Gerardo", "Apellidos": "Mir Garcia", "dni": "52656007Z"}'), JSON.parse('{"nombre": "Gerar2", "Apellidos": "Mir Garcia", "dni": "52656008Z"}')],
        [JSON.parse('{"id":"DA001","origen":"Madrid","destino":"Paris","fecha":"2022/11/31","hora":"14:00","horallegada":"19:15","asientosLibres": 30,"asientosOcupados":[""],"precio":240}')]);
    // La segunda compra tiene una fecha mayor, pero se puede cambiar desde aqui para hacer pruebas
    localStorage.removeItem('compras');
    var historial = [compra1, compra2];
    localStorage.setItem("compras", JSON.stringify(historial));
})();

function sumar47(date) { // crea una fecha inferior a las 48 horas
    date.setTime(date.getTime() + (47 * 60 * 60 * 1000));
    return date;
}
// Busca en el historial de compras las compras del usuario para mostrarlas. 
// En produccion  tendría que cargarlas del Storage de usuario sesion, 
// pero la app no tenia esta funcionalidad creada todavìa
function userHistorial() {
    let historial = JSON.parse(localStorage.compras);
    if (historial == null) { alert('Todavía no has hecho compras') };
    let comprasUsuario = historial.filter(element => {
        if (element.usuario == "gofthet@gmail.com") {
            return element;
        }
    });
    return comprasUsuario;
}
// Despliega el historial de compras del usuario de prueba
function desplegarHistorial() {
    let comprasUsuario = userHistorial();
    comprasUsuario.forEach((element, i) => {
        let contA = i;
        let numeroReserva = element.numReserva; // Numero de Reserva de cada una de las reservas
        let fechReserva = element.fechaReserva; // Fecha de Reserva de cada una de las reservas
        let pasajes = element.numPasajes; // No. de viajeros de cada una de las reservas
        let infoPasajeros = [];
        for (let i = 0; i < pasajes.length; i++) {
            if (infoPasajeros.length == 0) {
                infoPasajeros.push(pasajes[i].nombre + " " + pasajes[i].Apellidos);
            } else {
                infoPasajeros.push(pasajes[i].nombre + " " + pasajes[i].Apellidos);
            }
        }
        // Datos de cada vuelo, aqui me he dado cuenta al final que tendrìa que haber subido mas datos para mejorar
        // los datos de resumen del checking
        let vuelo = element.vuelo;
        let infoVuelos = [];
        for (let i = 0; i < vuelo.length; i++) {
            if (infoVuelos.length == 0) {
                infoVuelos.push(vuelo[i].id);
                infoVuelos.push(vuelo[i].destino);
                infoVuelos.push(vuelo[i].fecha);
                infoVuelos.push(vuelo[i].hora)
                infoVuelos.push(vuelo[i].precio);
            } else {
                infoVuelos.push(vuelo[i].id);
                infoVuelos.push(vuelo[i].destino);
                infoVuelos.push(vuelo[i].fecha);
                infoVuelos.push(vuelo[i].hora);
                infoVuelos.push(vuelo[i].precio);
            }
        }
        let fechaVuelo = infoVuelos[2] + " " + infoVuelos[3];
        let FechaVueloMs = new Date(fechaVuelo).getTime();
        let FechaAhoraMS = Date.now();
        // Calcula si las fechas del vuelo a imprimir es menor de 48h
        let diferenciaFechas = (FechaVueloMs - FechaAhoraMS) / (1000 * 60 * 60);
        // Generamos los datos a imprimir en pantalla
        let printReserva = `No. reserva: ${numeroReserva}`;
        let printFechaReserva = `Comprado el : ${fechReserva}`;
        let printPagado = `Total compra: ${infoVuelos[4]} €`;
        let printVuelo = `Número de vuelo: ${infoVuelos[0]}`;
        let printDestino = `Destino :${infoVuelos[1]}`;
        let container = document.createElement('div');
        container.setAttribute('class', 'container card');
        var documentFragment = document.createDocumentFragment();
        documentFragment.appendChild(container);
        let row1 = document.createElement('div');
        row1.setAttribute('class', 'row')
        let col1 = document.createElement('div');
        col1.setAttribute('class', 'col');
        let contenidoCol1 = document.createTextNode(printReserva);
        col1.appendChild(contenidoCol1);
        let col2 = document.createElement('div');
        col2.setAttribute('class', 'col right');
        let contenidoCol2 = document.createTextNode(printFechaReserva);
        col2.appendChild(contenidoCol2);
        let row2 = document.createElement('div');
        row2.setAttribute('class', 'row');
        let col3 = document.createElement('p');
        col3.setAttribute('class', 'col');
        let contenidoCol3 = document.createTextNode(printVuelo);
        let col4 = document.createElement('div');
        col4.setAttribute('class', 'col right');
        let contenidoCol4 = document.createTextNode(printDestino);
        col4.appendChild(contenidoCol4);
        col3.appendChild(contenidoCol3);
        let row3 = document.createElement('div');
        row3.setAttribute('class', 'row');
        let col5 = document.createElement('div');
        col5.setAttribute('class', 'col pasajeros');
        let titular = document.createElement('p');
        let titPasajeros = document.createTextNode("Pasajeros");
        titular.appendChild(titPasajeros);
        col5.appendChild(titular);
        let hr = document.createElement("hr");
        col5.appendChild(hr);
        // Genera el boton de disponibilidad de checking. Aqui hay un problema que no me ha dado tiempo
        // resolver, el que se deshabilite la opcion de chechin una ve se haya dado, pero mas adelante
        // en la validacion de los datos del checking, se comprueba si el viajero ya esta registrado para
        // ese vuelo
        for (let i = 0; i < infoPasajeros.length; i++) {
            let cont = i;
            let vueltas = [contA, cont];
            let contenidoCol5cont = document.createTextNode(cont + 1 + '. ' + infoPasajeros[i]);
            let parrafo = document.createElement('p');
            parrafo.appendChild(contenidoCol5cont);
            if (diferenciaFechas < 48) {
                let boton = document.createElement('button');
                boton.setAttribute('value', vueltas); // Se le asigna un valor que es igual a la posicion del viajero 
                boton.style.setProperty('float', 'right'); // para recoger sus datos despues e imprimirlos en pantalla
                let textButton = document.createTextNode('Checkin disponible')
                boton.appendChild(textButton);
                parrafo.appendChild(boton);
            }
            col5.appendChild(parrafo);
        }
        let row4 = document.createElement('div');
        row4.setAttribute('class', 'row');
        let col6 = document.createElement('div');
        col6.setAttribute('class', 'col right');
        let contenidoCol6 = document.createTextNode(printPagado);
        col6.appendChild(contenidoCol6);
        var documentFragment2 = document.createDocumentFragment();
        documentFragment2.appendChild(row1);
        row1.appendChild(col1);
        row1.appendChild(col2);
        row2.appendChild(col3);
        row2.appendChild(col4);
        row3.appendChild(col5);
        row4.appendChild(col6);
        container.appendChild(row1);
        container.appendChild(row2);
        container.appendChild(row3);
        container.appendChild(row4);
        document.body.appendChild(container);

    });
    boton();
}
// Sube el valor del boton de Checkin disponible que nos dice la posicion del usuario que hace el checkin, 
// para precargar sus datos en pantalla en la siguiente pantalla 
function boton() {
    let buttonList = document.querySelectorAll("button");
    for (let i = 1; i < buttonList.length; i++) {
        buttonList.forEach(function (i) {
            i.addEventListener("click", function (e) {
                const button = e.target;
                localStorage.setItem("checkinUser", JSON.stringify(button.value));
                window.location = "checking.html";
            })
        })
    }
}
desplegarHistorial()
