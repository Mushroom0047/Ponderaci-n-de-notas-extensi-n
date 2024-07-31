const tabs = document.querySelectorAll('input[name="tab-control"]');
const contents = document.querySelectorAll('.content section');
const btnCalcular = document.getElementById("btn-calcular-promedio");
const alerts = document.getElementById("alerts");
const btnAgregarNota = document.getElementById('agregar-nota');
let totalInputs = 0;

document.addEventListener('DOMContentLoaded', () => {
    //Cargar los inputs
    LoadInputArray();
    // Cargar los valores de localStorage al cargar la página
    loadStoredValues();

    // Guardar los valores de los inputs en localStorage cuando cambien
    addInputEventListeners();

    document.getElementById('clear-data').addEventListener('click', clearData);
});

btnCalcular.addEventListener("click", () => {
    // Comprueba si los input de porcentaje suman 100
    let sumaDePonderaciones = 0;
    document.querySelectorAll('input.input-ponderacion').forEach(input => {
        sumaDePonderaciones += parseInt(input.value) || 0; // Asegura que se sumen valores numéricos
    });

    if (sumaDePonderaciones !== 100) {
        alerts.textContent = "Los porcentajes deben sumar 100";
    } else {
        alerts.textContent = "";
        calcularPromedio();
    }
});

function calcularPromedio() {
    let arrNotas = [];
    let arrPond = [];
    document.querySelectorAll('input.input-nota').forEach(input => {
        arrNotas.push(parseFloat(input.value) || 0); // Asegura que los valores sean numéricos
    });
    document.querySelectorAll('input.input-ponderacion').forEach(input => {
        arrPond.push(parseFloat(input.value) || 0); // Asegura que los valores sean numéricos
    });

    if (arrNotas.length !== arrPond.length) {
        alerts.textContent = "El número de notas y ponderaciones no coincide.";
        return;
    }

    let sumaPonderada = 0;
    let sumaPesos = 0;

    for (let i = 0; i < arrNotas.length; i++) {
        sumaPonderada += arrNotas[i] * arrPond[i];
        sumaPesos += arrPond[i];
    }

    let promedioPonderado = sumaPonderada / sumaPesos;

    alerts.textContent = `El promedio ponderado es: ${promedioPonderado.toFixed(2)}`;
    return promedioPonderado;
}

function clearData() {
    // Limpiar los valores de los inputs
    document.querySelectorAll('input.input-nota').forEach((input, index) => {
        input.value = '';
        localStorage.removeItem('nota_' + index);
    });

    document.querySelectorAll('input.input-ponderacion').forEach((input, index) => {
        input.value = '';
        localStorage.removeItem('ponderacion_' + index);
    });
    localStorage.removeItem('total_inputs');

    alerts.textContent = ""; // Limpiar el mensaje de alerta
}

btnAgregarNota.addEventListener("click", () => {
    const tbody = document.getElementById("tbody-default");
    let trCount = tbody.getElementsByTagName('tr').length;
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td class="w-1/3 p-2 border-b">Nota ${trCount + 1}</td>
    <td class="w-1/3 p-2 border-b">
        <input 
        type="number" 
        min="0" 
        max="70" 
        step="1"
        class="input-nota w-full p-2 border rounded">
    </td>
    <td class="w-1/3 p-2 border-b">
        <div class="flex items-center">
        <input 
            type="number"
            min="0"
            max="100" 
            class="input-ponderacion w-full p-2 border rounded mr-2">
        <span>%</span>
        </div>
    </td>      
    `;
    tbody.appendChild(newRow);
    //sumar el tr a la variable de inputs
    addNewInputLine(totalInputs++);
    addInputEventListeners(); // Añadir event listeners a los nuevos inputs
});

function loadStoredValues() {
    document.querySelectorAll('input.input-nota').forEach((input, index) => {
        const storedNota = localStorage.getItem('nota_' + index);
        if (storedNota !== null) {
            input.value = storedNota;
        }
        totalInputs++;
    });

    addNewInputLine(totalInputs);

    document.querySelectorAll('input.input-ponderacion').forEach((input, index) => {
        const storedPonderacion = localStorage.getItem('ponderacion_' + index);
        if (storedPonderacion !== null) {
            input.value = storedPonderacion;
        }
    });
}

function addInputEventListeners() {
    document.querySelectorAll('input.input-nota').forEach((input, index) => {
        input.addEventListener('input', () => {
            localStorage.setItem('nota_' + index, input.value);
        });
    });

    document.querySelectorAll('input.input-ponderacion').forEach((input, index) => {
        input.addEventListener('input', () => {
            localStorage.setItem('ponderacion_' + index, input.value);
        });
    });
}

function addNewInputLine (inputs){
    localStorage.setItem('total_inputs', inputs);
}

function LoadInputArray(){
    let items = localStorage.getItem('total_inputs');

    for(items; items>0; items--){
        const tbody = document.getElementById("tbody-default");
        let trCount = tbody.getElementsByTagName('tr').length;
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
        <td class="w-1/3 p-2 border-b">Nota ${trCount + 1}</td>
        <td class="w-1/3 p-2 border-b">
            <input 
            type="number" 
            min="0" 
            max="70" 
            step="1"
            class="input-nota w-full p-2 border rounded">
        </td>
        <td class="w-1/3 p-2 border-b">
            <div class="flex items-center">
            <input 
                type="number"
                min="0"
                max="100" 
                class="input-ponderacion w-full p-2 border rounded mr-2">
            <span>%</span>
            </div>
        </td>      
        `;
        tbody.appendChild(newRow);
    }
}

