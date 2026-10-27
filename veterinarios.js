let veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];
let editandoId = null;

const IMAGEN_POR_DEFECTO = "assets/images/vete1.jpg";

const listadoVeterinarios = document.getElementById("listado-veterinarios");
const total = document.getElementById("total");
const formulario = document.getElementById("form-veterinarios");
const inputImagen = document.getElementById("imagen");

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

function render() {
  listadoVeterinarios.innerHTML = "";
  listadoVeterinarios.innerHTML = veterinarios
    .map(
      (veterinario) => `
        <tr>
            <td>${veterinario.matricula}</td>
            <td>${veterinario.nombre}</td>
            <td>${veterinario.especializacion}</td>
            <td>${formatoMoneda.format(veterinario.valorConsulta)}</td>
            <td>
                <img src="${veterinario.imagen || IMAGEN_POR_DEFECTO}" alt="Foto de ${veterinario.nombre}" class="img-thumbnail" style="max-width: 100px;">
            </td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarVeterinario('${veterinario.idVeterinario}')">
                Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarVeterinario('${veterinario.idVeterinario}')">
                Eliminar
                </button>
            </td>
        </tr>
  `,
    )
    .join("");

  total.textContent = veterinarios.length;
}

render();

function guardarEnLocalStorage() {
  try {
  localStorage.setItem("veterinarios", JSON.stringify(veterinarios));
  return true;
  } catch (error) {
    alert("No se pudo guardar: el espacio esta lleno. Proba con una foto mas chica o elimina un veterinario")
    return false;
  }
}

function leerImagen(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();

    lector.onerror = () => reject(new Error("No se pudo leer la imagen"));

    lector.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error("El archivo no es una imagen valida"));

      img.onload = () => {
        const anchoMaximo = 400;
        const escala = Math.min(1, anchoMaximo / img.width);

        const canvas = document.createElement("canvas");
        canvas.width = img.width * escala;
        canvas.height = img.height * escala;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };

      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });
}

function resetearFormulario() {
  formulario.reset();
  editandoId = null;
  document.getElementById("btnGuardar").textContent = "Guardar Veterinario";
  document.getElementById("btnCancelar").classList.add("d-none");
}

function editarVeterinario(id) {
  const veterinario = veterinarios.find((v) => v.idVeterinario === id);

  if (!veterinario) {
    return;
  }

  document.getElementById("matricula").value = veterinario.matricula;
  document.getElementById("nombre").value = veterinario.nombre;
  document.getElementById("especializacion").value =
    veterinario.especializacion;
  document.getElementById("valorConsulta").value = veterinario.valorConsulta;

  inputImagen.value = "";

  editandoId = id;

  document.getElementById("btnGuardar").textContent = "Guardar cambios";
  document.getElementById("btnCancelar").classList.remove("d-none");
}

function eliminarVeterinario(id) {
  const confirmar = confirm(
    "¿Estás seguro de que querés eliminar este veterinario?",
  );

  if (!confirmar) {
    return;
  }

  veterinarios = veterinarios.filter((v) => v.idVeterinario !== id);

  guardarEnLocalStorage();
  render();
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const datos = new FormData(formulario);

  let imagenSeleccionada = IMAGEN_POR_DEFECTO;

  if (editandoId) {
    const veteActual = veterinarios.find((v) => v.idVeterinario === editandoId);
    if (veteActual) {
      imagenSeleccionada = veteActual.imagen;
    }
  }

  const archivo = inputImagen.files[0];

  if (archivo) {
    try {
      imagenSeleccionada = await leerImagen(archivo);
    } catch (error) {
      alert(error.message);
      return;
    }
  }

  const registrarVeterinario = {
    idVeterinario: editandoId || crypto.randomUUID(),
    matricula: Number(datos.get("matricula")) || 0,
    nombre: datos.get("nombre").trim(),
    especializacion: datos.get("especializacion").trim(),
    valorConsulta: Number(datos.get("valorConsulta")) || 0,
    imagen: imagenSeleccionada,
  };

  if (editandoId) {
    const indice = veterinarios.findIndex(
      (v) => v.idVeterinario === editandoId,
    );

    if (indice !== -1) {
      veterinarios[indice] = registrarVeterinario;
    }
  } else {
    veterinarios.push(registrarVeterinario);
  }

  guardarEnLocalStorage();
  render();
  resetearFormulario();
});

document.getElementById("btnCancelar").addEventListener("click", resetearFormulario);
