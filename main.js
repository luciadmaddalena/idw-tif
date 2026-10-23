document.addEventListener('DOMContentLoaded', () => {
    const contenedorEquipo = document.getElementById('equipo-container');

 
    if (!contenedorEquipo) return;

    const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

   
    if (veterinarios.length === 0) {
        contenedorEquipo.innerHTML = '<p class="text-muted ms-3">Pronto agregaremos a los profesionales de nuestro equipo.</p>';
        return;
    }


    contenedorEquipo.innerHTML = '';

    veterinarios.forEach((veterinario) => {
        contenedorEquipo.innerHTML += `
            <div class="card" style="width: 18rem;">
                <img src="${veterinario.imagen}" class="card-img-top" alt="${veterinario.nombre}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${veterinario.nombre}</h5>
                    <p class="card-text">
                        <strong>Especialidad:</strong> ${veterinario.especializacion}<br>
                        <small class="text-muted">Matrícula: ${veterinario.matricula}</small>
                    </p>
                    <a href="contacto.html" class="btn btn-primary">Pedir Turno</a>
                </div>
            </div>
        `;
    });
});