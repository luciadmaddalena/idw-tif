const boton = document.querySelector('.hamburguesa');
const menu = document.querySelector('.menu');

boton.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', abierto);
});