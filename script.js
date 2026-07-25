document
.getElementById("buscar")
.addEventListener("click",()=>{

const codigo=document
.getElementById("codigo")
.value;

document
.getElementById("resultado")
.innerHTML=

"Buscando: "+codigo;

});