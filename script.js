let socios = [];
let encabezados = [];

// ==========================
// CARGAR CSV
// ==========================
async function cargarCSV() {

    try {

        const respuesta = await fetch("datos/socios.csv");

        const texto = await respuesta.text();

        const filas = texto.trim().split(/\r?\n/);

        // Detectar automáticamente el separador
        const separador = filas[0].includes(";") ? ";" : ",";

        // Leer encabezados
        encabezados = filas.shift().split(separador).map(c => c.trim());

        socios = filas.map(fila => {

            const columnas = fila.split(separador);

            let convenios = [];

            for (let i = 3; i < columnas.length; i++) {

                const valor = columnas[i].trim();

                // Ignorar celdas vacías
                if (valor === "")
                    continue;

                convenios.push({

                    titulo: encabezados[i],

                    valor: valor

                });

            }

            return {

                codigo: columnas[0].trim(),

                nombre: columnas[1].trim(),

                estado: columnas[2].trim(),

                convenios: convenios

            };

        });

        console.log("CSV cargado correctamente");
        console.log(socios);

    }

    catch (error) {

        console.error("Error cargando CSV:", error);

    }

}

cargarCSV();

// ==========================
// BOTÓN VALIDAR
// ==========================

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
            <h2>❌ Código no encontrado</h2>
        `;

        return;

    }

    if (socio.estado.toLowerCase() !== "activo") {

        resultado.innerHTML = `
            <h2>⚠ Tarjeta bloqueada</h2>

            <p><b>Numero de Tarjeta:</b> ${socio.nombre}</p>

            <p><b>Estado:</b> ${socio.estado}</p>
        `;

        return;

    }

    let listaConvenios = "";

    socio.convenios.forEach(convenio => {

        // Si el encabezado es Convenio4, Convenio5, Convenio6...
        if (/^convenio\d*$/i.test(convenio.titulo)) {

            listaConvenios += `
                <li>${convenio.valor}</li>
            `;

        }

        // Si tiene un nombre propio
        else {

            listaConvenios += `
                <li><b>${convenio.titulo}:</b> ${convenio.valor}</li>
            `;

        }

    });

    resultado.innerHTML = `

        <h2>✅ Tarjeta válida</h2>

        <p><b>Numero de Tarjeta:</b> ${socio.nombre}</p>

        <p><b>Estado:</b> ${socio.estado}</p>

        <h3>Convenios disponibles</h3>

        <ul>

            ${listaConvenios}

        </ul>

    `;

});
document.getElementById("scanButton").addEventListener("click", iniciarEscaner);

function iniciarEscaner() {

    const reader = document.getElementById("reader");

    reader.style.display = "block";

    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(

        { facingMode: "environment" },

        {
            fps: 10,
            qrbox: 250
        },

        (textoLeido) => {

            // Colocar automáticamente el código leído
            document.getElementById("codigo").value = textoLeido;

            // Detener la cámara
            html5QrCode.stop();

            reader.style.display = "none";

            // Ejecutar la validación automáticamente
            document.getElementById("buscar").click();

        },

        (error) => {

            // Ignorar errores mientras busca el QR
        }

    );

}
