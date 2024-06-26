const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('messageLogs', data => {
        console.log("Retorno", data);
        let log = document.getElementById('messageLogs');

        let table = `<table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Título</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>`;

        data.forEach(message => {
            table += `<tr>
                <td>${message.id}</td>
                <td>${message.title}</td>
                <td>${message.description}</td>
                <td><button onclick="deleteProduct('${message.id}')">Excluir</button></td>
            </tr>`;
        });

        table += `</tbody></table>`;
        log.innerHTML = table;
    });

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    window.deleteProduct = function(id) {
        socket.emit('deleteProduct', id);
    };

    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const product = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            code: document.getElementById('code').value,
            price: document.getElementById('price').value,
            category: document.getElementById('category').value,
            thumbnail: document.getElementById('thumbnail').value,
            stock: document.getElementById('stock').value
        }
        console.log("PRODUTO", product)
        socket.emit('newProduct', product);
        setTimeout(() => {
            document.getElementById('productForm').reset();  
        },1000)
      //  document.getElementById('productForm').reset();
    });
});