const socket = io();

listProducts.addEventListener('keyup', evt=>{
    console.log('keyup', evt.key);
    if(evt.key==="Enter"){
        if(listProducts.value.trim().length>0){
            socket.emit("message", {user:user, message: listProducts.value});
            listProducts.value="";
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('productItem', data => {
        console.log("Retorno", data);
        let log = document.getElementById('productItem');

        let table = `<table class="table">
            <thead>
                <tr class="table-row table-header">
                    <th class="table-cell">Título</th>
                    <th class="table-cell">Descrição</th>
                    <th class="table-cell">Código</th>
                    <th class="table-cell">Preço</th>
                    <th class="table-cell">Categoria</th>
                    <th class="table-cell">Thumbnail</th>
                    <th class="table-cell">Estoque</th>
                    <th class="table-cell">Id</th>
                    <th class="table-cell">Status</th>
                </tr>
            </thead>
            <tbody>`;

        data.forEach(message => {
            table += `<tr class="table-row">
                <td class="table-cell">${message.title}</td>
                <td class="table-cell">${message.description}</td>
                <td class="table-cell">${message.code}</td>
                <td class="table-cell">${message.price}</td>
                <td class="table-cell">${message.category}</td>
                <td class="table-cell">${message.thumbnail}</td>
                <td class="table-cell">${message.stock}</td>
                <td class="table-cell">${message.id}</td>
                <td class="table-cell">${message.status}</td>
            </tr>`;
        });

        table += `</tbody></table>`;

        log.innerHTML = table;
    });

    socket.on('connect', () => {
        console.log('Connected to server');
    });
});