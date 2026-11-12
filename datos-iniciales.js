const VETERINARIOS_BASE = [
  {
    idVeterinario: "vete-1",
    matricula: 1001,
    nombre: "María Perez",
    especializacion: "Perros pequeños",
    valorConsulta: 15000,
    imagen: "assets/images/vete1.jpg",
  },
  {
    idVeterinario: "vete-2",
    matricula: 1002,
    nombre: "Néstor Rodriguez",
    especializacion: "Felinos",
    valorConsulta: 15000,
    imagen: "assets/images/vete2.jpg",
  },
  {
    idVeterinario: "vete-3",
    matricula: 1003,
    nombre: "Flavia Sanchez",
    especializacion: "Perros grandes",
    valorConsulta: 15000,
    imagen: "assets/images/vete3.jpg",
  },
];

function cargarVeterinariosBase() {
  // Si ya se cargaron una vez, no hago nada (así, si eliminás uno, no reaparece)
  if (localStorage.getItem("veterinariosBaseCargados") === "si") {
    return;
  }

  const guardados = JSON.parse(localStorage.getItem("veterinarios")) || [];
  const lista = VETERINARIOS_BASE.concat(guardados);

  localStorage.setItem("veterinarios", JSON.stringify(lista));
  localStorage.setItem("veterinariosBaseCargados", "si");
}

cargarVeterinariosBase();
