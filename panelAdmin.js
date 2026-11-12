if (!estaLogueado()) {
    window.location.href = 'login.html'
}

const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];
const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
const historias = JSON.parse(localStorage.getItem('historias')) || [];


document.getElementById('nombre-usuario').textContent = 'Hola, ' + sessionStorage.getItem('usuario');
document.getElementById('total-mascotas').textContent = mascotas.length + ' registradas';
document.getElementById('total-veterinarios').textContent = veterinarios.length + ' registrados';
document.getElementById('total-turnos').textContent = turnos.length + ' registrados';
document.getElementById('total-historias').textContent = historias.length + ' registradas';
