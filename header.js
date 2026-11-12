const listaItems = document.querySelector(".navegacion ul");

if (estaLogueado()) {
  listaItems.innerHTML += `
        <li class="menu-panel">
            <a href="panelAdmin.html">Panel ▼</a>
             <ul class="submenu">
                <li><a href="mascotas.html">Mascotas</a></li>
                <li><a href="veterinarios.html">Veterinarios</a></li>
                <li><a href="turnos.html">Turnos</a></li>
                <li><a href="historia-clinica.html">Historia Clínica</a></li>
            </ul>
        </li>
        <li>
            <button class="btn btn-secondary" onclick="cerrarSesion()">Cerrar Sesión</button>
        </li>
    `;
  const linkLogin =
    document.getElementById("link-login") ||
    document.getElementById("link-container");
  if (linkLogin) {
    linkLogin.remove();
  }
}

