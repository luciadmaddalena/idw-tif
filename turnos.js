if (!estaLogueado()) {
  window.location.href = "login.html";
}

const CLAVE_MASCOTAS = "mascotas";
const CLAVE_VETERINARIOS = "veterinarios";
const CLAVE_TURNOS = "turnos";

const formTurno = document.getElementById("form-turno");
const selectMascota = document.getElementById("mascotaId");
const selectVeterinario = document.getElementById("veterinarioId");
const inputFecha = document.getElementById("fecha");
const inputHora = document.getElementById("hora");
const inputMotivo = document.getElementById("motivo");
const listadoTurnos = document.getElementById("listado-turnos");
const total = document.getElementById("total");

// leer y guardar el localstorage
function leerLista(clave) {
  const texto = localStorage.getItem(clave);
  if (texto === null) {
    return [];
  }
  return JSON.parse(texto);
}

function guardarLista(clave, lista) {
  localStorage.setItem(clave, JSON.stringify(lista));
}

// buscar por id 
function buscarMascota(id) {
  const mascotas = leerLista(CLAVE_MASCOTAS);
  for (let i = 0; i < mascotas.length; i++) {
    if (String(mascotas[i].id) === String(id)) {
      return mascotas[i];
    }
  }
  return null;
}

function buscarVeterinario(id) {
  const veterinarios = leerLista(CLAVE_VETERINARIOS);
  for (let i = 0; i < veterinarios.length; i++) {
    if (veterinarios[i].idVeterinario === id) {
      return veterinarios[i];
    }
  }
  return null;
}

// Llenar los desplegables
function agregarOpcion(select, valor, texto) {
  const opcion = document.createElement("option");
  opcion.value = valor;
  opcion.textContent = texto;
  select.appendChild(opcion);
}

function cargarSelects() {
  const mascotas = leerLista(CLAVE_MASCOTAS);
  for (let i = 0; i < mascotas.length; i++) {
    const texto = mascotas[i].nombreMascota + " (" + mascotas[i].nombreDuenio + ")";
    agregarOpcion(selectMascota, mascotas[i].id, texto);
  }

  const veterinarios = leerLista(CLAVE_VETERINARIOS);
  for (let i = 0; i < veterinarios.length; i++) {
    agregarOpcion(selectVeterinario, veterinarios[i].idVeterinario, veterinarios[i].nombre);
  }
}

// -validaciones

// corroboramos si el veterinario ya tiene un turno en esa fecha y hora
function turnoOcupado(veterinarioId, fecha, hora) {
  const turnos = leerLista(CLAVE_TURNOS);
  for (let i = 0; i < turnos.length; i++) {
    if (
      turnos[i].veterinarioId === veterinarioId &&
      turnos[i].fecha === fecha &&
      turnos[i].hora === hora
    ) {
      return true;
    }
  }
  return false;
}


function validarHorario(fecha, hora) {
  // 0 = domingo, 6 = sábado
  const diaSemana = new Date(fecha + "T00:00:00").getDay();

  if (diaSemana === 0) {
    return "Los domingos no hay atención con turno.";
  }

  if (diaSemana === 6) {
    // Sábado: 9 a 12
    if (hora < "09:00" || hora >= "12:00") {
      return "Los sábados se atiende de 9 a 12 hs.";
    }
  } else {
    // Lunes a viernes: 8:30 a 12 y 16:30 a 20
    const enLaManana = hora >= "08:30" && hora < "12:00";
    const enLaTarde = hora >= "16:30" && hora < "20:00";
    if (!enLaManana && !enLaTarde) {
      return "De lunes a viernes se atiende de 8:30 a 12 y de 16:30 a 20 hs.";
    }
  }

  return "";
}

// para la tabla
function crearCelda(texto) {
  const td = document.createElement("td");
  if (texto === "" || texto === undefined || texto === null) {
    td.textContent = "-";
  } else {
    td.textContent = texto;
  }
  return td;
}

function renderizar() {
  const turnos = leerLista(CLAVE_TURNOS);
  listadoTurnos.innerHTML = "";

  for (let i = 0; i < turnos.length; i++) {
    const t = turnos[i];

    const mascota = buscarMascota(t.mascotaId);
    let nombreMascota = "(mascota eliminada)";
    let nombreDuenio = "-";
    if (mascota !== null) {
      nombreMascota = mascota.nombreMascota;
      nombreDuenio = mascota.nombreDuenio;
    }

    const vet = buscarVeterinario(t.veterinarioId);
    let nombreVet = "(veterinario eliminado)";
    if (vet !== null) {
      nombreVet = vet.nombre;
    }

    const fila = document.createElement("tr");
    fila.appendChild(crearCelda(t.fecha));
    fila.appendChild(crearCelda(t.hora));
    fila.appendChild(crearCelda(nombreMascota));
    fila.appendChild(crearCelda(nombreDuenio));
    fila.appendChild(crearCelda(nombreVet));
    fila.appendChild(crearCelda(t.motivo));

    // celda con el boton eliminar
    const celdaAcciones = document.createElement("td");
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.className = "btn btn-danger btn-sm";
    botonEliminar.addEventListener("click", function () {
      eliminarTurno(t.id);
    });
    celdaAcciones.appendChild(botonEliminar);
    fila.appendChild(celdaAcciones);

    listadoTurnos.appendChild(fila);
  }

  total.textContent = turnos.length;
}

// eliminar
function eliminarTurno(id) {
  const confirmar = confirm("¿Seguro que querés eliminar este turno?");
  if (!confirmar) {
    return;
  }

  const turnos = leerLista(CLAVE_TURNOS);
  const turnosQuedan = [];

  // Me quedo con todos los turnos menos el que quiero borrar
  for (let i = 0; i < turnos.length; i++) {
    if (turnos[i].id !== id) {
      turnosQuedan.push(turnos[i]);
    }
  }

  guardarLista(CLAVE_TURNOS, turnosQuedan);
  renderizar();
}

// guardar turno nuevo
function guardarTurno(evento) {
  evento.preventDefault();

  const veterinarioId = selectVeterinario.value;
  const fecha = inputFecha.value;
  const hora = inputHora.value;

  const error = validarHorario(fecha, hora);
  if (error !== "") {
    alert(error);
    return;
  }

  if (turnoOcupado(veterinarioId, fecha, hora)) {
    alert("Ese veterinario ya tiene un turno en esa fecha y hora. Elegí otro horario.");
    return;
  }

  const turno = {
    id: Date.now(),
    mascotaId: selectMascota.value,
    veterinarioId: veterinarioId,
    fecha: fecha,
    hora: hora,
    motivo: inputMotivo.value.trim(),
  };

  const turnos = leerLista(CLAVE_TURNOS);
  turnos.push(turno);
  guardarLista(CLAVE_TURNOS, turnos);

  formTurno.reset();
  renderizar();
}


formTurno.addEventListener("submit", guardarTurno);

cargarSelects();
renderizar();