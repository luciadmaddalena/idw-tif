const listaItems = document.querySelector('.navegacion ul');

if (estaLogueado()) {
    listaItems.innerHTML += `
        <li>
            <a href="panelAdmin.html">Panel</a>
        </li>
        <li>
            <a href="mascotas.html">Mascotas</a>
        </li>
        <li>
            <a href="veterinarios.html">Veterinarios</a>
        </li>
        <li>
            <button class="btn btn-secondary" onclick="cerrarSesion()">Cerrar Sesión</button>
        </li>
    `;

    document.getElementById('link-login').remove();
}

const botonMenu = document.querySelector('.hamburguesa');
const menu = document.querySelector('.menu');

if (botonMenu && menu) {
    botonMenu.addEventListener('click', () => {
        const abierto = menu.classList.toggle('abierto');

        botonMenu.setAttribute('aria-expanded', abierto);
    });
}