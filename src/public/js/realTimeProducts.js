const socket = io();

window.logout = async () => {
  const url = "api/sessions/logout";

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

document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  socket.on("productItem", (data) => {
    console.log("Retorno", data);
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

    data.forEach((message) => {
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
  });

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  window.deleteProduct = function (id) {
    socket.emit("deleteProduct", id);
  };

  document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const product = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      code: document.getElementById("code").value,
      price: document.getElementById("price").value,
      category: document.getElementById("category").value,
      thumbnail: document.getElementById("thumbnail").value,
      stock: document.getElementById("stock").value,
    };
    const currentProducts = document.querySelectorAll(
      "#productItem table tbody tr"
    );
    const existingCode = Array.from(currentProducts).find((row) => {
      const productCode = row.querySelector(
        ".table-cell:nth-child(4)"
      ).textContent;
      return parseInt(productCode) === parseInt(product.code);
    });

    if (existingCode) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Produto com este código já existe!",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 4000,
      });
      return;
    }
    console.log("PRODUTO", product);
    socket.emit("newProduct", product);
    setTimeout(() => {
      document.getElementById("productForm").reset();
    }, 1000);
  });
});

const irListaUsuarios = async () => {
  
  const url = `users`;
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
