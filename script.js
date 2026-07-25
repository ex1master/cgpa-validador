let socios = [];

// Cargar el CSV al iniciar
async function cargarCSV() {
    try {

        const respuesta = await fetch("datos/socios.csv");

        const texto = await respuesta.text();

        const filas = texto.trim().split(/\r?\n/);

        // Eliminar encabezado
        filas.shift();

        socios = filas.map(fila => {

            // Detectar automáticamente el separador
            const separador = fila.includes(";") ? ";" : ",";

            const columnas = fila.split(separador);

            return {

                codigo: columnas[0].trim(),

                nombre: columnas[1].trim(),

                estado: columnas[2].trim(),

                convenios: columnas
                    .slice(3)
                    .map(c => c.trim())
                    .filter(c => c !== "")

            };

        });

        console.log("Socios cargados:", socios);

    }
    catch (error) {

        console.error("Error cargando CSV:", error);

    }

}

cargarCSV();

document.getElementById("buscar").addEventListener("click", () => {

    const codigoBuscado = document
        .getElementById("codigo")
        .value
        .trim();

    const resultado = document.getElementById("resultado");

    if (codigoBuscado === "") {

        resultado.innerHTML = "<h3>Ingrese un código.</h3>";

        return;

    }

    const socio = socios.find(s => s.codigo === codigoBuscado);

    if (!socio) {

        resultado.innerHTML = `
            <h3>❌ Código no encontrado</h3>
        `;

        return;

    }

    if (socio.estado.toLowerCase() !== "activo") {

        resultado.innerHTML = `
            <h3>⚠ Tarjeta bloqueada</h3>

            <p><b>Nombre:</b> ${socio.nombre}</p>

            <p><b>Estado:</b> ${socio.estado}</p>
        `;

        return;

    }

    let listaConvenios = "";

    socio.convenios.forEach(convenio => {

        listaConvenios += `<li>${convenio}</li>`;

    });

    resultado.innerHTML = `

        <h2>✅ Tarjeta válida</h2>

        <p><b>Nombre:</b> ${socio.nombre}</p>

        <p><b>Estado:</b> ${socio.estado}</p>

        <h3>Convenios disponibles</h3>

        <ul>

            ${listaConvenios}

        </ul>

    `;

});