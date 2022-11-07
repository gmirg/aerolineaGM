(function escribeResumen() {
    let checked = JSON.parse(localStorage.getItem('checkdInVuelo'));
    resumenVuelo(checked[0].idVuelo)
    resumenPasajero(checked[0].pasajero[0].nombre,checked[0].pasajero[0].dni);
    resumenAsiento(checked[0].pasajero[0].asiento);
})();

function resumenPasajero(pasajero,dni) {
    var div = document.getElementsByClassName('resumenpasajeros')[0];
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(`Nombre: ${pasajero}\nDNI: ${dni}`));
    div.appendChild(p);
}

function resumenVuelo(vuelo) {
    var divResumenVuelo = document.getElementsByClassName("resumenvuelo")[0];
    var p1 = document.createElement("p")
    p1.appendChild(document.createTextNode((`Vuelo: ${vuelo}`)));
    divResumenVuelo.appendChild(p1)
}

function resumenAsiento(asiento) {
    var div = document.getElementsByClassName('resumenasiento')[0];
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(`Asiento: ${asiento}`));
    div.appendChild(p);
}