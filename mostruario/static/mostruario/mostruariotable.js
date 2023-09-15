const username = document.currentScript.dataset.username;


document.addEventListener('DOMContentLoaded', function() {

    if (localStorage.getItem(`table_${username}`) == undefined) {
        document.querySelector('#table-input').style.display = 'block';
        document.querySelector('#table-mostruario').style.display = 'none';
    }
    else {
        document.querySelectorAll('thead > tr')[1].querySelector('th').innerHTML = localStorage.getItem(`description_${username}`);
        document.querySelector('#tdiscount').innerHTML = localStorage.getItem(`discount_${username}`);

        for (const x in JSON.parse(localStorage[`table_${username}`])){ 
            const ref = JSON.parse(localStorage[`table_${username}`])[x];
            if (ref.IN == true) {
                const newDiv = createRow(ref.REFERENCIA, ref.DESCRICAO, ref.PRECO, ref.QUANTIDADE, control = false);
                document.querySelector("tbody").append(newDiv);
            }
        }

        resetTable();

        document.querySelector('#FAltDisc').querySelector('input').value;
        document.querySelector('#table-mostruario').style.display = 'block';
    }


    document.querySelector('#send-prices').onsubmit = function() {

        const description = document.querySelector("[name='description']").value;
        localStorage.setItem(`description_${username}`, description);
        const discount = document.querySelector("[name='discount']").value;
        localStorage.setItem(`discount_${username}`, discount);
        const csrftoken = document.querySelector("input[name='csrfmiddlewaretoken']").value;
        let formData = new FormData();
        formData.append('file', document.querySelector("[type='file']").files[0]);
        
        fetch('/', {
            method: 'POST',
            body: formData,
            headers: {
                "X-CSRFToken": csrftoken,
            },
        })
        .then(response => response.json())
        .then(result => {
            console.log(result.table);
            localStorage.setItem(`table_${username}`, JSON.stringify(result.table));
            localStorage.setItem(`bruto_${username}`, 0);
            localStorage.setItem(`qnt_${username}`, 0);
        })

        document.querySelectorAll("table > thead > tr")[1].querySelectorAll('th')[0].innerHTML = description;
        document.querySelectorAll("table > tfoot > tr")[1].querySelectorAll('td > span')[1].innerHTML = discount;

        resetTable();

        document.querySelector('#table-input').style.display = 'none';
        document.querySelector('#table-mostruario').style.display = 'block';

        return false;
    }

    document.querySelector("#adicionar").addEventListener('click', addItem);
    document.querySelector("#referencia").addEventListener('keyup', function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            addItem();
        }
    });

    document.querySelector("#FAltDisc").onsubmit = function() {
        const discount = document.querySelector('#FAltDisc').querySelector('input').value;
        localStorage.setItem(`discount_${username}`, discount);

        document.querySelector('#tdiscount').innerHTML = discount;
        updateLastROw();

        document.querySelector('#FAltDisc').querySelector('input').value = '';
        return false;
    }

    document.querySelector("#download-csv").addEventListener('click', function() {
        fetch('/csvmodel')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'model.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
    });
});

function addItem() {
    const newReference = document.querySelector("#referencia").value;
    document.querySelector("#referencia").value = '';
    const newDescription = document.querySelector("#descricao").value;
    document.querySelector("#descricao").value = '';
    const newPrice = document.querySelector("#preco").value;
    document.querySelector("#preco").value = '';
    const newQuant = ((document.querySelector("#quantidade").value == '') ? 1 : document.querySelector("#quantidade").value);
    document.querySelector("#quantidade").value = '';

    const references = JSON.parse(localStorage.getItem(`table_${username}`))[newReference];
    if (references == undefined || references == null || newReference == '') {
        if ((references == undefined || references == null) && newPrice == '') {
        const newDiv = creatAlert(`Referencia <strong>${newReference}</strong> não encontrada.`);
        document.querySelector("#table-mostruario").append(newDiv);
        }
        else if (newReference == '' && newPrice != '') {
            const newDiv = creatAlert(`Referencia não pode ser vazia.`);
            document.querySelector("#table-mostruario").append(newDiv);
        }
        else if(newReference != '' && newPrice != ''){
            const table = JSON.parse(localStorage.getItem(`table_${username}`));
            table[newReference] = {
                'REFERENCIA': newReference,
                'DESCRICAO': newDescription,
                'PRECO': newPrice,
                'QUANTIDADE': 0,
                'IN': false
            };
            localStorage.setItem(`table_${username}`, JSON.stringify(table));
            const newR = table[newReference];
            const newDiv = createRow(newR.REFERENCIA, newR.DESCRICAO, newR.PRECO, newQuant);
            document.querySelector("tbody").append(newDiv);
        }
        else {
            const newDiv = creatAlert(`Referencia não pode ser vazia.`);
            document.querySelector("#table-mostruario").append(newDiv);
        }
    }
    else {
        const newDiv = createRow(references.REFERENCIA, references.DESCRICAO, references.PRECO, newQuant);
        document.querySelector("tbody").append(newDiv);
    }
        
}

function creatAlert(sAlert){
    const newDiv = document.createElement('div');
    newDiv.className = 'absolute top-0 right-0 mt-[60px] mr-4';
    newDiv.innerHTML = `
    <div id="toast-warning" class="flex items-center max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
        </svg>
        <span class="sr-only">Warning icon</span>
    </div>
    <div class="ml-3 text-sm font-normal">${sAlert}</div>
    <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-warning" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
    </button>
    </div>
    `;

    newDiv.querySelector('button').addEventListener('click', function() {
        newDiv.remove();
    })

    return newDiv;
}

function createRow(reference, description, price, quant, control = true) {
    const newRow = document.createElement('tr');
    newRow.className = 'border-b dark:border-neutral-500';
    newRow.innerHTML = `
    <td class="whitespace-nowrap border-r px-2 py-1 font-medium dark:border-neutral-500">${reference}</td>
    <td class="whitespace-nowrap border-r px-3 py-1 dark:border-neutral-500">${quant}</td>
    <td colspan='2' class="whitespace-nowrap border-r px-3 py-1 dark:border-neutral-500">${description}</td>
    <td class="whitespace-nowrap border-r px-3 py-1 dark:border-neutral-500">${price}</td>
    <td class="whitespace-nowrap border-r px-3 py-1 dark:border-neutral-500">R$ ${Math.round(price * quant * 100) / 100}</td>
    <td class="whitespace-nowrap py-1 print:hidden">
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-8.414L14.414 14 16 12.414 13.586 10 16 7.586 14.414 6 12 8.414 9.586 6 8 7.586 10.414 10 8 12.414 9.586 14 12 11.586z" clip-rule="evenodd" />
            </svg>
        </button>
    </td>
    `;

    newRow.querySelector('button').addEventListener('click', function() {
        updateTable(reference, quant * -1, price, true);
        newRow.remove();
    });

    updateTable(reference, quant, price, control);

    return newRow;
}

function updateTable(reference, quant, price, control) {
    if (control == true) {
        const table = JSON.parse(localStorage.getItem(`table_${username}`));
        table[reference].QUANTIDADE = table[reference].QUANTIDADE + quant;
        table[reference].IN = (table[reference].QUANTIDADE > 0) ? true : false;
        localStorage.setItem(`table_${username}`, JSON.stringify(table));

        localStorage.setItem(`bruto_${username}`, parseFloat(localStorage.getItem(`bruto_${username}`)) + (parseInt(quant) * parseFloat(price)));
        localStorage.setItem(`qnt_${username}`, parseInt(localStorage.getItem(`qnt_${username}`)) + parseInt(quant));
    }

    updateLastROw();
    
}

function updateLastROw() {
    document.querySelector("#bruto").innerHTML = Math.round((parseFloat(localStorage.getItem(`bruto_${username}`)) < 0.1) ? 0 : parseFloat(localStorage.getItem(`bruto_${username}`)) * 100) / 100;
    document.querySelector("#fquant").innerHTML = localStorage.getItem(`qnt_${username}}`);
    document.querySelector("#liquido").innerHTML = Math.round(((parseFloat(localStorage.getItem(`bruto_${username}`)) < 0.1) ? 0 : parseFloat(localStorage.getItem(`bruto_${username}`))) * (1 - (parseFloat(document.querySelector('#tdiscount').innerHTML) / 100)) * 100) / 100;
}

function resetTable() {
    document.querySelector('#cancelar').addEventListener('click', function() {
        localStorage.removeItem(`table_${username}`);
        localStorage.removeItem(`description_${username}`);
        localStorage.removeItem(`discount_${username}`);
        localStorage.removeItem(`bruto_${username}`);
        localStorage.removeItem(`qnt_${username}`);

        location.reload();
    });
}