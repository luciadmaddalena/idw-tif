let mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
let editandoId = null;


const listadoMascotas = document.getElementById('listado-mascotas');

const total = document.getElementById('total');

const formulario = document.getElementById('form-mascota');

function render() {
    
    listadoMascotas.innerHTML = '';


    mascotas.forEach((mascota) => {
        listadoMascotas.innerHTML += `
            <tr>
                <td>${mascota.nombreDuenio}</td>

                <td>${mascota.nombreMascota}</td>

                <td>${mascota.color}</td>

                <td>${mascota.edad}</td>

                <td>${mascota.peso}</td>
                <td>
                    <button class="btn btn-warning btn-sm"                   
                    onclick="editarMascota('${mascota.idMascota}')">
                    Editar
                    </button>

                    <button class="btn btn-danger btn-sm"
                    onclick="eliminarMascota('${mascota.idMascota}')">
                    Eliminar
                    </button>
                </td>
            </tr>
        `
    });

    total.textContent = mascotas.length;
};

render();

function guardarEnLocalStorage() {
    localStorage.setItem('mascotas', JSON.stringify(mascotas))
}

function editarMascota(id) {
    const mascota = mascotas.find(
        (mascota) => mascota.idMascota === id
    );

    if (!mascota) {
        return;
    }

    document.getElementById('nombreDuenio').value = mascota.nombreDuenio;
    document.getElementById('nombreMascota').value = mascota.nombreMascota;
    document.getElementById('color').value = mascota.color;
    document.getElementById('edad').value = mascota.edad;
    document.getElementById('peso').value = mascota.peso;

    editandoId = id;

    document.getElementById('botonAgregarMascota').textContent = 'Guardar cambios';
}

function eliminarMascota(id) {
    const confirmar = confirm('¿Estás segura de que querés eliminar esta mascota?');

    if (!confirmar) {
        return;
    }

    mascotas = mascotas.filter(
        (mascota) => mascota.idMascota !== id
    );

    guardarEnLocalStorage();
    render();

}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);

    const nuevaMascota = {
        idMascota: editandoId || crypto.randomUUID(),
        nombreDuenio: datos.get('nombreDuenio').trim(),
        nombreMascota: datos.get('nombreMascota').trim(),
        color: datos.get('color').trim(),
        edad: Number(datos.get('edad')),
        peso: parseFloat(datos.get('peso'))
    };

    if (editandoId) {

        const indice = mascotas.findIndex(

            (mascota) => mascota.idMascota === editandoId
        );

        if (indice !== -1) {
        mascotas[indice] = nuevaMascota;
        }

    } else {
    mascotas.push(nuevaMascota);
    }
    
    guardarEnLocalStorage();

    render();
    formulario.reset();

    editandoId = null;

    document.getElementById('botonAgregarMascota').textContent = 'Agregar Mascota';

})


