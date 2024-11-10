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

const api = '/api/users'

const getUsers = async (page = 1) => {
  const response = await fetch(`${api}?limit=2&page=${page}`, {
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
                <th class="table-cell">Nome</th>
                <th class="table-cell">Sobrenome</th>
                <th class="table-cell">Email</th>
                <th class="table-cell">Tipo</th>
                <th class="table-cell">Ação</th>
            </tr>
        </thead>
        <tbody>`;

  data.payload.forEach((user) => {
    table += `<tr class="table-row">
            <td class="table-cell">${user.first_name}</td>
            <td class="table-cell">${user.last_name}</td>
            <td class="table-cell">${user.email}</td>
            <td class="table-cell">${user.role}</td>
            <td class="table-cell">
                <button id="cartsButton" onclick="editar('${user._id}')">Editar</button>
                <button id="logoutButton" onclick="excluir('${user._id}', '${user.first_name}')">Excluir</button>

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

const editar = async (pid) => {
  Swal.fire({
    title: "Identificar",
    html:
      '<select id="swal-role" class="swal2-input">' +
        '<option value="user">User</option>' +
        '<option value="admin">Admin</option>' +
      '</select>',
    allowOutsideClick: false,
  }).then(async () => {
    const role = document.getElementById("swal-role").value;

    try {
      const response = await fetch(`${api}/${pid}/${role}`, {
        method: "PUT",
      });

      if (response.ok) {
        
        Swal.fire({
          icon: "success",
          title: "Atualização!",
          text: "Perfil atualizado com sucesso.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          location.reload();
        });
      } else {
        const error = await response.json();
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Erro ao atualizar: " + error.message,
        });
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Erro ao excluir.",
      });
    }
  });
  
};

const teste = async (pid, nome) => {
  Swal.fire({
    title: `Você tem certeza que deseja exclui o usuário ${nome}?`,
    text: "Isso limpará o registro.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "swal2-custom-popup",
      title: "swal2-custom-title",
      cancelButton: "swal2-custom-cancel-button",
      confirmButton: "swal2-custom-confirm-button",
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${api}/${pid}`, {
          method: "DELETE",
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Excluído!",
            text: "Usuário excluido com sucesso.",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            location.reload();
          });
        } else {
          const error = await response.json();
          Swal.fire({
            icon: "error",
            title: "Erro!",
            text: "Erro ao excluir: " + error.message,
          });
        }
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Erro ao excluir.",
        });
      }
    }
  });
};

const excluir = async (pid, nome) => {
  Swal.fire({
    title: `Você tem certeza que deseja exclui o usuário ${nome}?`,
    text: "Isso limpará o registro.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "swal2-custom-popup",
      title: "swal2-custom-title",
      cancelButton: "swal2-custom-cancel-button",
      confirmButton: "swal2-custom-confirm-button",
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${api}/${pid}`, {
          method: "DELETE",
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Excluído!",
            text: "Usuário excluido com sucesso.",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            location.reload();
          });
        } else {
          const error = await response.json();
          Swal.fire({
            icon: "error",
            title: "Erro!",
            text: "Erro ao excluir: " + error.message,
          });
        }
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Erro ao excluir.",
        });
      }
    }
  });
};

const nextPage = () => {
  getUsers(paginate.nextPage);
};

const prevPage = () => {
  getUsers(paginate.prevPage);
};

/*const logout = async () => {
  const url = "sessions/logout";

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
};*/

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
  titulo.textContent = `Bem vindo, ${getUsuarioLoagdo()}, à lista de usuários`;
}

/*const irParaCarrinho = async () => {
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
};*/

const irListaProdutos = async () => {
  
//  const url = `http://localhost:8080/realTimeProducts`;
const url = `realTimeProducts`;
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
getUsers();
