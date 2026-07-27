let socios = [];


// ==========================
// CARGAR CSV
// ==========================

async function cargarCSV() {

    try {

        const respuesta = await fetch("datos/socios.csv");

        const texto = await respuesta.text();

        const filas = texto.trim().split(/\r?\n/);


        const separador = filas[0].includes(";") ? ";" : ",";


        const encabezados = filas.shift()
            .split(separador)
            .map(c => c.trim());


        socios = filas.map(fila => {


            const columnas = fila.split(separador);


            let convenios = [];


            // Desde columna 4 en adelante
            // cada convenio ocupa 2 columnas:
            // nombre convenio + archivo

            for(let i = 3; i < columnas.length; i += 2) {


                const titulo = encabezados[i];

                const valor = columnas[i]?.trim();

                const archivo = columnas[i + 1]?.trim();



                if(!valor || valor === "")
                    continue;



                convenios.push({

                    titulo: titulo,

                    valor: valor,

                    archivo: archivo

                });


            }



            return {

                codigo: columnas[0].trim(),

                nombre: columnas[1].trim(),

                estado: columnas[2].trim(),

                convenios: convenios

            };


        });



        console.log("Datos cargados:", socios);


    }

    catch(error){

        console.error(
            "Error leyendo CSV:",
            error
        );

    }

}


cargarCSV();



// ==========================
// VALIDAR TARJETA
// ==========================


document.getElementById("buscar")
.addEventListener("click",()=>{


    const codigo =
    document.getElementById("codigo")
    .value
    .trim();



    const resultado =
    document.getElementById("resultado");



    const socio =
    socios.find(
        s => s.codigo === codigo
    );



    if(!socio){

        resultado.innerHTML =
        `
        <h2>❌ Código no encontrado</h2>
        `;

        return;

    }



    if(socio.estado.toLowerCase() !== "activo"){


        resultado.innerHTML =
        `

        <h2>⚠ Tarjeta bloqueada</h2>

        <p>
        ${socio.nombre}
        </p>

        `;

        return;

    }




    let lista = "";



    socio.convenios.forEach(c=>{


        let detalle = "";



        if(c.archivo){

            detalle =
            `
            <br>
            <a href="convenios/${c.archivo}"
            target="_blank">

            📄 Ver detalles del convenio

            </a>
            `;

        }



        if(/^convenio\d*$/i.test(c.titulo)){


            lista +=
            `
            <li>
            ${c.valor}
            ${detalle}
            </li>
            `;


        }

        else{


            lista +=
            `
            <li>

            <b>${c.titulo}:</b>
            ${c.valor}

            ${detalle}

            </li>
            `;


        }



    });



    resultado.innerHTML =

    `

    <h2>✅ Tarjeta válida</h2>

    <p>
    <b>Nombre:</b> ${socio.nombre}
    </p>


    <h3>Convenios disponibles</h3>


    <ul>

    ${lista}

    </ul>

    `;



});
