let paginate = {
    nextPage: 0,    
    prevPage: 0,
    currentPage: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
    totalDocs: 0
}


const getProducts = async (page = 1) => {
    const response = await fetch(`/api/products?limit=2&page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    
    const itemsPerPage = data.limit;
    paginate.currentPage = data.page;
    paginate.nextPage = data.nextPage;
    paginate.prevPage = data.prevPage ? data.prevPage: 0;
    paginate.totalPages = data.totalPages;
    paginate.hasNextPage = data.hasNextPage;
    paginate.hasPrevPage = data.hasPrevPage;
    paginate.totalDocs = data.totalDocs;
   
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

    data.payload.forEach(message => {
        table += `<tr class="table-row">
            <td class="table-cell">${message._id}</td>
            <td class="table-cell">${message.title}</td>
            <td class="table-cell">${message.description}</td>
            <td class="table-cell">${message.code}</td>
            <td class="table-cell">${message.price}</td>
            <td class="table-cell">${message.category}</td>
            <td class="table-cell">${message.thumbnail}</td>
            <td class="table-cell">${message.stock}</td>
            <td class="table-cell">${message.status}</td>
            <td class="table-cell"><button onclick="deleteProduct('${message._id}')">Excluir</button></td>
        </tr>`;
    });

    table += `</tbody></table>`;
    log.innerHTML = table;

    // Atualize os controles de paginação
    document.getElementById('pageIndicator').innerText = `Página ${paginate.currentPage} de ${paginate.totalPages} - Total de itens: ${paginate.totalDocs}`;
    document.getElementById('prevPage').disabled = !paginate.hasPrevPage;
    document.getElementById('nextPage').disabled = !paginate.hasNextPage;
    ;
};

const nextPage = () => {
    getProducts(paginate.nextPage);
};

const prevPage = () => {
    getProducts(paginate.prevPage);
};

getProducts();