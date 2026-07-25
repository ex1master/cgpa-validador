let socios = [];

// Cargar el CSV al iniciar
async function cargarCSV() {
    const respuesta = await fetch("datos/socios.csv");
    const texto = await respuesta.text();

    const filas = texto.trim().split("\n");

    // Quitar encabezado
    filas.shift();

    socios = filas.map(fila => {
        const [codigo, nombre, estado] = fila.split(",");

        return {
            codigo: codigo.trim(),
            nombre: nombre.trim(),
            estado: estado.trim()
        };
    });

    console.log("Socios cargados:", socios);
}

cargarCSV();

document.getElementById("buscar").addEventListener("click", () => {

    const codigoBuscado =
        document.getElementById("codigo").value.trim();

    const socio = socios.find(s => s.codigo === codigoBuscado);

    const resultado = document.getElementById("resultado");

    if (!socio) {

        resultado.innerHTML =
            "<h3>❌ Código no encontrado</h3>";

        return;
    }

    if (socio.estado === "Bloqueado") {

        resultado.innerHTML = `
            <h3>⚠ Tarjeta bloqueada</h3>
            <p>${socio.nombre}</p>
        `;

        return;
    }

    resultado.innerHTML = `
        <h3>✅ Tarjeta válida</h3>

        <p><b>Nombre:</b> ${socio.nombre}</p>

        <p><b>Estado:</b> ${socio.estado}</p>
    `;

});