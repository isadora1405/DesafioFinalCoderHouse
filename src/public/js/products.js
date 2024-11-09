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
let cid = "";

const getCartId = async () => {
  try {
    const response = await fetch("/api/carts/my-cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao obter o carrinho");
    }
    const cart = await response.json();
    if (!cart || !cart._id) {
      throw new Error("Carrinho não encontrado");
    }

    return cart._id;
  } catch (error) {
    console.error("Erro ao obter o id do carrinho:", error.message);
    throw error;
  }
};

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
                <button onclick="addCart('${product._id}')">Adicionar ao Carrinho</button>
            </td>
        </tr>`;
  });

  table += `</tbody></table>`;
  log.innerHTML = table;

  document.getElementById(
    "pageIndicator"
  ).innerText = `Página ${paginate.currentPage} de ${paginate.totalPages} - Total de itens: ${paginate.totalDocs}`;
  document.getElementById("prevPage").disabled = !paginate.hasPrevPage;
  document.getElementById("nextPage").disabled = !paginate.hasNextPage;
};

const addCart = async (pid) => {
  const cartId = await getCartId();
  if (!cartId) {
    console.error("Erro: Cart ID não disponível");
    return;
  }

  const url = `/api/carts/${cartId}/products/${pid}`;

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

const irParaChat = () => {
  window.location.href = "/chat";
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
  }
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function getUsuarioLoagdo() {
  return decodeURIComponent(getCookie("userName"));
}

function definirTitulo() {
  const titulo = document.getElementById("titulo");
  titulo.textContent = `Bem vindo, ${getUsuarioLoagdo()}, à lista de produtos`;
}

const irParaCarrinho = async () => {
  const cartId = await getCartId();
  if (!cartId) {
    console.error("Erro: Cart ID não disponível");
    return;
  }

  const url = `http://localhost:8080/carts/${cartId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    window.location.href = response.url;
  } else {
    console.error("Erro ao acessar o carrinho");
  }
};

const irListaUsuarios = async () => {
  
  const url = `http://localhost:8080/users`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    window.location.href = response.url;
  } else {
    console.error("Erro ao acessar a lista de usuários");
  }
};

definirTitulo();
getProducts();
