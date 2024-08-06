document
  .getElementById("clear-cart")
  .addEventListener("click", async function () {
    const cartId = this.getAttribute("data-cart-id");
    if (!cartId) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "ID do carrinho não encontrado.",
      });
      return;
    }

    Swal.fire({
      title: "Você tem certeza?",
      text: "Isso limpará todos os itens do seu carrinho.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, limpar!",
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
          const response = await fetch(`/api/carts/${cartId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "Limpo!",
              text: "Seu carrinho foi limpo.",
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
              text: "Erro ao limpar o carrinho: " + error.message,
            });
          }
        } catch (error) {
          console.error("Erro ao fazer a requisição:", error);
          Swal.fire({
            icon: "error",
            title: "Erro!",
            text: "Erro ao limpar o carrinho.",
          });
        }
      }
    });
  });

  const buscarDados = async () => {
    const response = await fetch(`/api/carts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const re = await response.json();
    console.log("Dados", re.payload[0])
  };

  const irParaProdutos = async () => {
    const url = "http://localhost:8080/products";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response", response);
      window.location.href = response.url; // Redirecionar para a página de login após logout
    } catch (error) {
      console.error("Erro de rede", error);
    }
  };

  
buscarDados();