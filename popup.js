let totalInputs = 1;
const version = 'v1.0.0';

document.addEventListener('DOMContentLoaded', () => {
    totalInputs = localStorage.getItem('total_inputs') ? parseInt(localStorage.getItem('total_inputs')) : 1;
    localStorage.setItem('total_inputs', totalInputs);
    CreateNewInput(totalInputs);

    //* Clicks Events
    //? Limpiar datos
    document.getElementById('clear-data').addEventListener('click', LimpiarDatos);

    //? Calcular promedio
    document.getElementById("btn-calcular-promedio").addEventListener('click', calcularPromedio);

    //? Agregar nota
    document.getElementById('agregar-nota').addEventListener('click', () => {
        totalInputs++;
        localStorage.setItem('total_inputs', totalInputs);
        CreateNewInput(1);
    });


    //* Actualizar inputs
    document.querySelectorAll('input.input-nota').forEach(input => {
        input.addEventListener('input', ActualizarDatosLocalStorage);
    });

    document.querySelectorAll('input.input-ponderacion').forEach(input => {
        input.addEventListener('input', ActualizarDatosLocalStorage);
    });

    //* Leer datos del local storage
    LeerDatosDelLocalStorage();

    //* Actualizar labels 
    updateInputsNumber();

    //* Actualizar version
    document.querySelector('.version').textContent = version;
});

function ActualizarDatosLocalStorage() {
    // Leer datos actuales del local storage
    const notasJSON = localStorage.getItem('notas');
    const notas = notasJSON ? JSON.parse(notasJSON) : {};

    // Actualizar el objeto con los nuevos valores
    document.querySelectorAll('input.input-nota').forEach((input, index) => {
        const inputPonderacion = document.querySelectorAll('input.input-ponderacion')[index];
        notas[`nota${index + 1}`] = {
            value: input.value || '',
            ponderacion: inputPonderacion ? inputPonderacion.value || '' : ''
        };
    });

    // Convertir el objeto a una cadena JSON y almacenarlo en el local storage
    localStorage.setItem('notas', JSON.stringify(notas));
}

function LimpiarDatos() {
    document.querySelectorAll('input.input-nota').forEach((input) => {
        input.value = '';
    });
    document.querySelectorAll('input.input-ponderacion').forEach((input) => {
        input.value = '';
    });

    localStorage.removeItem('notas');
}

function LeerDatosDelLocalStorage() {
    const notasJSON = localStorage.getItem('notas');

    if (notasJSON) {
        const notas = JSON.parse(notasJSON);
        // Recorrer el objeto y actualizar los inputs
        Object.keys(notas).forEach((key, index) => {
            const notaData = notas[key];

            // Obtener el input de nota y ponderación por índice
            const inputNota = document.querySelectorAll('input.input-nota')[index];
            const inputPonderacion = document.querySelectorAll('input.input-ponderacion')[index];

            // Si el input existe, actualizar sus valores
            if (inputNota) {
                inputNota.value = notaData.value || '';
            }

            if (inputPonderacion) {
                inputPonderacion.value = notaData.ponderacion || '';
            }
        });
    }
}


function calcularPromedio() {    
    // Comprueba si los input de porcentaje suman 100
    let sumaDePonderaciones = 0;
    document.querySelectorAll('input.input-ponderacion').forEach(input => {
        sumaDePonderaciones += parseInt(input.value) || 0; // Asegura que se sumen valores numéricos
    });

    if (sumaDePonderaciones !== 100) {
        alertMessage("Los porcentajes deben sumar 100");
        return;
    } else {
        alertMessage();
        let arrNotas = [];
        let arrPond = [];
        let inputsValidos = true;
        
        document.querySelectorAll('input.input-nota').forEach(input => {
            let nota = parseFloat(input.value);
            if (isNaN(nota) || nota === 0) {
                inputsValidos = false;
            }
            arrNotas.push(nota || 0); // Asegura que los valores sean numéricos
        });
        document.querySelectorAll('input.input-ponderacion').forEach(input => {
            arrPond.push(parseFloat(input.value) || 0); // Asegura que los valores sean numéricos
        });

        if (!inputsValidos) {
            alertMessage("Todas las notas deben ser números y no pueden ser 0");
            return;
        }

        if (arrNotas.length !== arrPond.length) {
            alertMessage("El número de notas y ponderaciones no coincide");
            return;
        }

        let sumaPonderada = 0;
        let sumaPesos = 0;

        for (let i = 0; i < arrNotas.length; i++) {
            sumaPonderada += arrNotas[i] * arrPond[i];
            sumaPesos += arrPond[i];
        }

        let promedioPonderado = sumaPonderada / sumaPesos;

        alertMessage(`El promedio ponderado es: ${promedioPonderado.toFixed(2)}`);
        return promedioPonderado;
    }
}

function GuardarNotasEnLocalStorage() {
    const inputsNota = document.querySelectorAll('input.input-nota');
    const inputsPonderacion = document.querySelectorAll('input.input-ponderacion');
    const notas = {};

    inputsNota.forEach((input, index) => {
        notas[`nota${index + 1}`] = {
            value: input.value,
            ponderacion: inputsPonderacion[index] ? inputsPonderacion[index].value : null
        };
    });

    // Convertir el objeto a una cadena JSON y almacenarlo en el local storage
    localStorage.setItem('notas', JSON.stringify(notas));
}

function alertMessage (message){
    const divAlerts = document.getElementById('alerts');
    divAlerts.innerHTML = ''

    if(message){
        const newP = document.createElement('p');
        newP.classList.add('italic', 'font-bold');
        newP.textContent = message;
        divAlerts.appendChild(newP);
    }
}
function updateInputsNumber(){
    const divInputs = document.getElementById("div-inputs");
    let counter = 1;
    //* Recorrer listado de inputs con clase input_nota
    divInputs.querySelectorAll('input.input-nota').forEach((input) => {
        //* Por cada input reemplazar el nombre por Nota ${counter}
        const label = input.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            label.textContent = `Nota ${counter}`;
        }
        //* Aumentar en 1 el counter
        counter++;
    })
}

function CreateNewInput(qtyItemsToCreate = 1) {
    const divInputs = document.getElementById("div-inputs");
    let counterElements = divInputs.getElementsByTagName("article").length + 1 || 1;

    while (qtyItemsToCreate > 0) {
        const newRow = document.createElement('article');
        newRow.classList.add('flex', 'space-x-4', 'w-full', 'bg-gray-100', 'p-2');

        newRow.innerHTML = `
            <div class="flex-1">
                <label for="input-nota-${counterElements}" class="font-bold block mb-2">Nota ${counterElements}</label>
                <input type="number" id="input-nota-${counterElements}" class="input-nota w-full p-2" min="1" max="7" step="0.1">
            </div>
            <div class="flex-1">
                <label for="input-ponderacion-${counterElements}" class="font-bold block mb-2">Ponderación %</label>
                <input type="number" id="input-ponderacion-${counterElements}" class="input-ponderacion w-full p-2" min="1" max="100" step="1">
                <span class="percent-span">%</span>
            </div>
            <div class=" flex text-center justify-center items-center">
                <a class="eliminar_nota">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </a>
            </div>
        `;

        divInputs.appendChild(newRow);

        // Add event listener to the newly created button
        newRow.querySelector('.eliminar_nota').addEventListener('click', function() {
            const article = this.closest('article');
            article.parentNode.removeChild(article);
            totalInputs--;
            localStorage.setItem('total_inputs', totalInputs);
            alertMessage();
            updateInputsNumber();
        });

        newRow.querySelector('input.input-nota').addEventListener('input', ActualizarDatosLocalStorage);
        newRow.querySelector('input.input-ponderacion').addEventListener('input', ActualizarDatosLocalStorage);

        qtyItemsToCreate--;
        counterElements++;    
    }
    updateInputsNumber();
}

