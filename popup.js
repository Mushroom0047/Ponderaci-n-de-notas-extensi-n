const tabs = document.querySelectorAll('input[name="tab-control"]');
const contents = document.querySelectorAll('.content section');

tabs.forEach((tab, index) => {
    tab.addEventListener('change', () => {
        contents.forEach(content => content.classList.add('hidden'));
        contents[index].classList.remove('hidden');
    });
});

const btnAgregarNota = document.getElementById('agregar-nota');
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
        max="7" 
        step="0.1"
        class="w-full p-2 border rounded">
    </td>
    <td class="w-1/3 p-2 border-b">
        <div class="flex items-center">
        <input 
            type="number"
            min="0"
            max="100" 
            class="agregar-nota w-full p-2 border rounded mr-2">
        <span>%</span>
        </div>
    </td>      
    `;
    tbody.appendChild(newRow);
})