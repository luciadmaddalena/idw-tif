let veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];
let editandoId = null;

const listadoVeterinarios = document.getElementById('listado-veterinarios');

const total = document.getElementById('total');

const formulario = document.getElementById('form-veterinarios');

const formatoMoneda = new Intl.NumberFormat('es-AR', {
    style: "currency",
    currency: 'ARS'
});

function render() {

    listadoVeterinarios.innerHTML = '';


    veterinarios.forEach((veterinario) => {
        listadoVeterinarios.innerHTML += `
            <tr>
                <td>${veterinario.matricula}</td>

                <td>${veterinario.nombre}</td>

                <td>${veterinario.especializacion}</td>

                <td>${formatoMoneda.format(veterinario.valorConsulta)}</td>
                <td>
                    <button class="btn btn-warning btn-sm"
                    onclick="editarVeterinario('${veterinario.idVeterinario}')">
                    Editar
                    </button>

                    <button class="btn btn-danger btn-sm"
                    onclick="eliminarVeterinario('${veterinario.idVeterinario}')">
                    Eliminar
                    </button>
                </td>
            </tr>
                       
        `
    });

    total.textContent = veterinarios.length;
};

render();

function guardarEnLocalStorage() {
    localStorage.setItem('veterinarios', JSON.stringify(veterinarios))
}

function editarVeterinario(id) {
    const veterinario = veterinarios.find(
        (veterinario) => veterinario.idVeterinario === id
    );

    if (!veterinario) {
        return;
    }

    document.getElementById('matricula').value = veterinario.matricula;
    document.getElementById('nombre').value = veterinario.nombre;
    document.getElementById('especializacion').value = veterinario.especializacion;
    document.getElementById('valorConsulta').value = veterinario.valorConsulta;

    editandoId = id;

    document.getElementById('btnGuardar').textContent = 'Guardar cambios';
    document.getElementById('btnCancelar').classList.remove('d-none');
}

function eliminarVeterinario(id) {
    const confirmar = confirm('¿Estás segura de que querés eliminar este veterinario?');

    if (!confirmar) {
        return;
    }

    veterinarios = veterinarios.filter(
        (veterinario) => veterinario.idVeterinario !== id
    );

    guardarEnLocalStorage();
    render();
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);

    const registrarVeterinario = {
        idVeterinario: editandoId || crypto.randomUUID(),   
        matricula: Number (datos.get('matricula')) || 0,
        nombre: datos.get('nombre').trim(),
        especializacion: datos.get('especializacion').trim(),
        valorConsulta: Number(datos.get('valorConsulta')),
    };

    if (editandoId) {
        const indice = veterinarios.findIndex((veterinario) => veterinario.idVeterinario === editandoId);

    if (indice !== -1) {
        veterinarios[indice] = registrarVeterinario;
    }
    } else {
        veterinarios.push(registrarVeterinario);
    }

    guardarEnLocalStorage();
    render();
    formulario.reset();

    editandoId = null

    document.getElementById('btnGuardar').textContent = 'Guardar Veterinario';
    document.getElementById('btnCancelar').classList.add('d-none');
})

document.getElementById('btnCancelar').addEventListener('click', () => {
    formulario.reset();

    editandoId = null;

    document.getElementById('btnGuardar').textContent = 'Guardar Veterinario';
    document.getElementById('btnCancelar').classList.add('d-none');
});
