const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('productItem', data => {
        console.log("Retorno", data);
        let log = document.getElementById('productItem');

        let table = `<table class="table">
            <thead>
                <tr class="table-row table-header">
                    <th class="table-cell">Id</th>
                    <th class="table-cell">Título</th>
                    <th class="table-cell">Descrição</th>
                    <th class="table-cell">Código</th>
                    <th class="table-cell">Preço</th>
                    <th class="table-cell">Categoria</th>
                    <th class="table-cell">Thumbnail</th>
                    <th class="table-cell">Estoque</th>
                    <th class="table-cell">Status</th>
                    <th class="table-cell">Ações</th>
                </tr>
            </thead>
            <tbody>`;

        data.forEach(message => {
            table += `<tr class="table-row">
                <td class="table-cell">${message.id}</td>
                <td class="table-cell">${message.title}</td>
                <td class="table-cell">${message.description}</td>
                <td class="table-cell">${message.code}</td>
                <td class="table-cell">${message.price}</td>
                <td class="table-cell">${message.category}</td>
                <td class="table-cell">${message.thumbnail}</td>
                <td class="table-cell">${message.stock}</td>
                <td class="table-cell">${message.status}</td>
                <td class="table-cell"><button onclick="deleteProduct('${message.id}')">Excluir</button></td>
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
        const currentProducts = document.querySelectorAll('#productItem table tbody tr');
        const existingCode = Array.from(currentProducts).find(row => {
            const productCode = row.querySelector('.table-cell:nth-child(4)').textContent;
            return parseInt(productCode) === parseInt(product.code);
        });

        if (existingCode) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Produto com este código já existe!',
            });
            return;
        }
        console.log("PRODUTO", product)
        socket.emit('newProduct', product);
        setTimeout(() => {
            document.getElementById('productForm').reset();  
        },1000)
    });
});