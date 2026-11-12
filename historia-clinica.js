const CLAVE_MASCOTAS = "mascotas";
const CLAVE_VETERINARIOS = "veterinarios";
const CLAVE_HISTORIAS = "historias";


const form = document.getElementById("form-historia");
const selectMascota = document.getElementById("mascotaId");
const selectVeterinario = document.getElementById("veterinarioId");
const filtro = document.getElementById("filtro-mascota");
const ficha = document.getElementById("ficha-mascota");
const tbody = document.getElementById("listado-historias");
const total = document.getElementById("total");

// leer y guardar en localstorage
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

function buscarMascota(id) {
  const mascotas = leerLista(CLAVE_MASCOTAS);
  for (let i = 0; i < mascotas.length; i++) {
    if (String(mascotas[i].id) === String(id)) {
      return mascotas[i]; // la encontré
    }
  }
  return null; // no estaba
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

function nombreVeterinario(id) {
  const vet = buscarVeterinario(id);

  if (vet === null) {
    return "-";
  }

  let nombre = vet.nombre;
  if (vet.apellido) {
    nombre = nombre + " " + vet.apellido;
  }
  return nombre;
}

function agregarOpcion(select, valor, texto) {
  const opcion = document.createElement("option");
  opcion.value = valor;
  opcion.textContent = texto;
  select.appendChild(opcion);
}

function cargarSelects() {
  const mascotas = leerLista(CLAVE_MASCOTAS);
  for (let i = 0; i < mascotas.length; i++) {
    const texto =
      mascotas[i].nombreMascota + " (" + mascotas[i].nombreDuenio + ")";
    agregarOpcion(selectMascota, mascotas[i].id, texto);
    agregarOpcion(filtro, mascotas[i].id, texto);
  }

  const veterinarios = leerLista(CLAVE_VETERINARIOS);
  for (let i = 0; i < veterinarios.length; i++) {
    // el valor es el idVeterinario y el texto es directamente el nombre
    agregarOpcion(
      selectVeterinario,
      veterinarios[i].idVeterinario,
      veterinarios[i].nombre,
    );
  }
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

function mostrarFicha(idMascota) {
  const mascota = buscarMascota(idMascota);

  if (idMascota === "" || mascota === null) {
    ficha.classList.add("d-none"); // ocultar
  } else {
    ficha.textContent =
      mascota.nombreMascota +
      " · " +
      mascota.especie +
      " · Dueño: " +
      mascota.nombreDuenio;
    ficha.classList.remove("d-none"); // mostrar
  }
}

function renderizar() {
  const historias = leerLista(CLAVE_HISTORIAS);
  const idFiltro = filtro.value;
  let cantidad = 0;

  tbody.innerHTML = "";

  // recorro las histoias de atrás para adelante asi las nuevas aparecen arriba
  for (let i = historias.length - 1; i >= 0; i--) {
    const h = historias[i];

    // si hay una mascota elegida en el filtro se saltean las demas
    if (idFiltro !== "" && String(h.mascotaId) !== idFiltro) {
      continue;
    }

    const mascota = buscarMascota(h.mascotaId);
    let nombreMascota = "(mascota eliminada)";
    if (mascota !== null) {
      nombreMascota = mascota.nombreMascota;
    }

    const fila = document.createElement("tr");
    fila.appendChild(crearCelda(h.fecha));
    fila.appendChild(crearCelda(nombreMascota));
    fila.appendChild(crearCelda(h.motivo));
    fila.appendChild(crearCelda(h.diagnostico));
    fila.appendChild(crearCelda(h.tratamiento));
    fila.appendChild(crearCelda(h.peso));
    fila.appendChild(crearCelda(h.temperatura));
    fila.appendChild(crearCelda(h.proximoControl));
    fila.appendChild(crearCelda(nombreVeterinario(h.veterinarioId)));
    tbody.appendChild(fila);

    cantidad++;
  }

  total.textContent = cantidad;
  mostrarFicha(idFiltro);
}

// guardar una consulta nueva
function guardarHistoria(evento) {
  evento.preventDefault();

  const historia = {
    id: Date.now(),
    mascotaId: selectMascota.value,
    veterinarioId: selectVeterinario.value,
    fecha: document.getElementById("fecha").value,
    motivo: document.getElementById("motivo").value.trim(),
    diagnostico: document.getElementById("diagnostico").value.trim(),
    tratamiento: document.getElementById("tratamiento").value.trim(),
    peso: document.getElementById("peso").value,
    temperatura: document.getElementById("temperatura").value,
    proximoControl: document.getElementById("proximoControl").value,
  };

  const historias = leerLista(CLAVE_HISTORIAS);
  historias.push(historia);
  guardarLista(CLAVE_HISTORIAS, historias);

  // dejo el filtro en la mascota recien cargada para ver historial
  filtro.value = historia.mascotaId;
  form.reset();
  renderizar();
}


form.addEventListener("submit", guardarHistoria);
filtro.addEventListener("change", renderizar);

cargarSelects();
renderizar();
