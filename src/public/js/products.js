let paginate = {
  nextPage: 0,
  prevPage: 0,
  currentPage: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
  totalDocs: 0,
};

let listProducts = [];
let cid = "66951b80b92bf0319e6bcb38"; //Id do caqrrinho colocado em uma variável global, mas futuramente pode ser buscado do localStorage

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
  paginate.prevPage = data.prevPage ? data.prevPage : 0;
  paginate.totalPages = data.totalPages;
  paginate.hasNextPage = data.hasNextPage;
  paginate.hasPrevPage = data.hasPrevPage;
  paginate.totalDocs = data.totalDocs;
  listProducts = data.payload;

  let log = document.getElementById("productItem");

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

  data.payload.forEach((product) => {
    table += `<tr class="table-row">
            <td class="table-cell">${product._id}</td>
            <td class="table-cell">${product.title}</td>
            <td class="table-cell">${product.description}</td>
            <td class="table-cell">${product.code}</td>
            <td class="table-cell">${product.price}</td>
            <td class="table-cell">${product.category}</td>
            <td class="table-cell">${product.thumbnail}</td>
            <td class="table-cell">${product.stock}</td>
            <td class="table-cell">${product.status}</td>
            <td class="table-cell">
                <button onclick="addCart('${cid}', '${product._id}')">Adicionar ao Carrinho</button>
            </td>
        </tr>`;
  });

  table += `</tbody></table>`;
  log.innerHTML = table;

  // Atualize os controles de paginação
  document.getElementById(
    "pageIndicator"
  ).innerText = `Página ${paginate.currentPage} de ${paginate.totalPages} - Total de itens: ${paginate.totalDocs}`;
  document.getElementById("prevPage").disabled = !paginate.hasPrevPage;
  document.getElementById("nextPage").disabled = !paginate.hasNextPage;
};

const addCart = async (cid, pid) => {
  const url = `/api/carts/${cid}/products/${pid}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();

      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: result.message,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: false,
      });
    } else {
      console.error("Erro ao adicionar produto ao carrinho");
    }
  } catch (error) {
    console.error("Erro de rede", error);
  }
};

const nextPage = () => {
  getProducts(paginate.nextPage);
};

const prevPage = () => {
  getProducts(paginate.prevPage);
};

const logout = async () => {
  const url = "http://localhost:8080/api/sessions/logout";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response", response);
    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Deslogado com sucesso",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: false,
      }).then(() => {
        window.location.href = response.url; // Redirecionar para a página de login após logout
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Erro ao deslogar",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: false,
      });
    }
  } catch (error) {
    console.error("Erro de rede", error);
    Swal.fire({
      icon: "error",
      title: "Erro de rede",
      text: error.message,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
    });
  }
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function getUsuarioLoagdo() {
  return decodeURIComponent(getCookie('userName'));
}

function definirTitulo() {
  const titulo = document.getElementById('titulo');
  titulo.textContent = `Bem vindo, ${getUsuarioLoagdo()}, à lista de produtos`
}

definirTitulo();
getProducts();
