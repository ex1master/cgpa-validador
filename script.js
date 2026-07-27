let socios = [];

const rutaConvenios = "/convenios/";


// ==========================
// CARGAR CSV
// ==========================

async function cargarCSV() {

    try {

        const respuesta = await fetch("datos/socios.csv");

        const texto = await respuesta.text();


        const filas = texto
            .trim()
            .split(/\r?\n/);



        // Detectar separador

        const separador = filas[0].includes(";")
            ? ";"
            : ",";



        // Leer encabezados

        const encabezados = filas.shift()
            .split(separador)
            .map(c => c.trim());



        socios = filas.map(fila => {


            const columnas = fila.split(separador);



            let convenios = [];



            /*
                Desde la columna 3:

                Columna 3  = nombre convenio
                Columna 4  = archivo

                Columna 5  = siguiente convenio
                Columna 6  = archivo

            */


            for (
                let i = 3;
                i < columnas.length;
                i += 2
            ) {


                const titulo =
                    encabezados[i]
                    ?.trim();



                const valor =
                    columnas[i]
                    ?.trim();



                const archivo =
                    columnas[i + 1]
                    ?.trim();




                // Si no hay beneficio, saltar

                if (
                    !valor ||
                    valor === ""
                ) {

                    continue;

                }



                convenios.push({

                    titulo: titulo,

                    valor: valor,

                    archivo: archivo

                });


            }



            return {


                codigo:
                    columnas[0]
                    ?.trim(),



                nombre:
                    columnas[1]
                    ?.trim(),



                estado:
                    columnas[2]
                    ?.trim(),



                convenios:
                    convenios


            };


        });



        console.log(
            "Socios cargados:",
            socios
        );


    }


    catch(error) {


        console.error(
            "Error cargando CSV:",
            error
        );


    }


}



cargarCSV();





// ==========================
// VALIDAR TARJETA
// ==========================


document
.getElementById("buscar")
.addEventListener(
"click",
validarTarjeta
);



function validarTarjeta(){


    const codigo =
        document
        .getElementById("codigo")
        .value
        .trim();



    const resultado =
        document
        .getElementById("resultado");



    if(!codigo){


        resultado.innerHTML =
        `
        <h3>
        Ingrese un código
        </h3>
        `;


        return;

    }




    const socio =
        socios.find(
            s =>
            s.codigo === codigo
        );




    if(!socio){


        resultado.innerHTML =
        `
        <h2>
        ❌ Código no encontrado
        </h2>
        `;


        return;

    }




    if(
        socio.estado
        .toLowerCase()
        !==
        "activo"
    ){


        resultado.innerHTML =
        `

        <h2>
        ⚠ Tarjeta Bloqueada
        </h2>

        <p>
        <b>Nombre:</b>
        ${socio.nombre}
        </p>

        <p>
        <b>Estado:</b>
        ${socio.estado}
        </p>

        `;


        return;

    }





    let listaConvenios = "";




    socio.convenios
    .forEach(
    convenio => {



        let enlace = "";



        if(
            convenio.archivo &&
            convenio.archivo !== ""
        ){


            enlace =
            `

            <br>

            <a href="${rutaConvenios}${convenio.archivo}"
               target="_blank">

            📄 Ver detalles del convenio

            </a>

            `;


        }





        // Si se llama Convenio4, Convenio5, etc.

        if(
            /^convenio\d+$/i
            .test(convenio.titulo)
        ){


            listaConvenios +=
            `

            <li>

            ${convenio.valor}

            ${enlace}

            </li>


            `;


        }


        else {



            listaConvenios +=
            `

            <li>

            <b>
            ${convenio.titulo}:
            </b>

            ${convenio.valor}

            ${enlace}

            </li>


            `;


        }



    });





    resultado.innerHTML =

    `

    <h2>
    ✅ Tarjeta válida
    </h2>


    <p>
    <b>Nombre:</b>
    ${socio.nombre}
    </p>



    <h3>
    Convenios disponibles
    </h3>


    <ul>

    ${listaConvenios}

    </ul>


    `;



}

// ==========================
// LECTOR QR
// ==========================

document
.getElementById("scanButton")
.addEventListener(
"click",
iniciarEscaner
);


function iniciarEscaner(){


    const reader =
    document.getElementById("reader");


    reader.style.display = "block";


    const html5QrCode =
    new Html5Qrcode("reader");



    html5QrCode.start(

        {
            facingMode: "environment"
        },


        {
            fps: 10,
            qrbox: 250
        },


        (codigoLeido)=>{


            console.log(
                "QR leído:",
                codigoLeido
            );


            // Coloca el código en el input

            document
            .getElementById("codigo")
            .value = codigoLeido;



            // Detiene cámara

            html5QrCode.stop()
            .then(()=>{


                reader.style.display =
                "none";


            });



            // Valida automáticamente

            validarTarjeta();



        },


        (error)=>{

            // Ignorar errores mientras busca

        }


    )

    .catch(error=>{


        console.error(
            "No se pudo iniciar cámara:",
            error
        );


    });


}
