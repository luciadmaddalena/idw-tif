function obtenerToken() {
    return sessionStorage.getItem('accessToken');
}

function estaLogueado() {
    return obtenerToken() !== null;
}

function cerrarSesion() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('usuario');

    window.location.href = 'login.html';
}

function protegerPagina() {
    if (!estaLogueado()) {
        window.location.href = 'login.html';
    }
}