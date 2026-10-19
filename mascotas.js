let mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
let editandoId = null;

const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];

const listadoMascotas = document.getElementById('listado-mascotas');

const total = document.getElementById('total');

const formulario = document.getElementById('form-mascota');

// función para cargar los datos
// al entrar en la web
function render() {
    // primer paso limpiar la tabla por si hay datos previos motrandose, que no se dupliquen
    listadoMascotas.innerHTML = '';


    mascotas.forEach((mascota) => {
        listadoMascotas.innerHTML += `
            <tr>
                <td>${mascota.nombreDuenio}</td>

                <td>${mascota.nombreMascota}</td>

                <td>${mascota.color}</td>

                <td>${mascota.edad}</td>

                <td>${mascota.peso}</td>
            </tr>
        `
    });

    total.textContent = mascotas.length;
};

render();

function guardarEnLocalStorage() {
    localStorage.setItem('mascotas', JSON.stringify(mascotas))
}


formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(formulario);

    const nuevaMascota = {
        idMascota: crypto.randomUUID(),
        // usar datos.get y pasarle por parametro 
        // el valor de la propiedad name de el input que queremos capturar
        // en el html tenemos <input type="text" name="nombreDuenio" id="nombreDuenio" class="form-control" required>
        nombreDuenio: datos.get('nombreDuenio').trim(),
        nombreMascota: datos.get('nombreMascota').trim(),
        color: datos.get('color').trim(),
        edad: Number(datos.get('edad')),
        peso: parseFloat(datos.get('peso'))
    }

    mascotas.push(nuevaMascota);
    
    guardarEnLocalStorage();

    render();
    formulario.reset();
})

