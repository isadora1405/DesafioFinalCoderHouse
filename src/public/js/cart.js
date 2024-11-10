const calcularTotalCarrinho = () => {
  const items = document.querySelectorAll(".cart-item"); // Classe dos itens no carrinho
  let total = 0;

  items.forEach((item) => {
    const price = parseFloat(item.getAttribute("data-price")); // Atributo com o preço
    const quantity = parseInt(item.getAttribute("data-quantity")); // Atributo com a quantidade
    total += price * quantity;
  });

  return total;
};
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

document
  .getElementById("finalize-purchase")
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

    const amount = calcularTotalCarrinho(); // Exemplo de valor total da compra, você pode obter isso dinamicamente
    const totalItens = document.querySelectorAll(".cart-item").length;
    console.log("Total", amount)

    Swal.fire({
      title: "Confirmação",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Pagar",
      cancelButtonText: "Cancelar",
      html:
        '<div style="text-align: left; margin-bottom: 10px;">' +
          '<span id="swal-quantity" style="font-size: 1.1em;">Quantidade de Itens: ' + totalItens + '</span><br>' +
          '<span id="swal-total" style="font-size: 1.1em;">Valor Total: R$' + amount.toFixed(2) + '</span>' +
        '</div>' +
        '<hr>' +
        '<h3 style="font-size: 1.2em; text-align: left; margin-top: 10px;">Dados para pagamento (Apenas no Cartão de Crédito)</h3>' +
        '<div style="text-align: left !important;">' +
          '<input id="card-number" type="text" class="swal2-input" style="width: 90%, maxlength="16" placeholder="Número do Cartão">' +
          '<input id="card-holder" type="text" class="swal2-input" style="width: 90%;" placeholder="Nome no Cartão">' +
          '<div style="display: flex; gap: 10px; justify-content: space-between;">' +
            '<div style="flex: 1;">' +
              '<input id="expiry-date" type="text" class="swal2-input" style="width: 90%;" placeholder="Validade (MM/AA)">' +
            '</div>' +
            '<div style="flex: 1;">' +
              '<input id="cvv" type="text" class="swal2-input" style="width: 40%;" maxlength="3" placeholder="CVV">' +
            '</div>' +
          '</div>' +
        '</div>',
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
         
          const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }),
          });
    
  
          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "Compra finalizada!",
              text: "Sua compra foi realizada com sucesso.",
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              location.href = '/products';
            });
          } else {
            const error = await response.json();
            Swal.fire({
              icon: "error",
              title: "Erro!",
              text: "Erro ao finalizar a compra: " + error.message,
            });
          }
        } catch (error) {
          console.error("Erro ao fazer a requisição:", error);
          Swal.fire({
            icon: "error",
            title: "Erro!",
            text: "Erro ao finalizar a compra.",
          });
        }
      }
    });;
    
    

   /* try {
      const response = await fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Compra finalizada!",
          text: "Sua compra foi realizada com sucesso.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      } else {
        const error = await response.json();
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Erro ao finalizar a compra: " + error.message,
        });
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Erro ao finalizar a compra.",
      });
    }*/
  });

const buscarDados = async () => {
  const response = await fetch(`/api/carts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const re = await response.json();
  console.log("Dados", re);
};

const irParaProdutos = async () => {
  const url = "/products";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    window.location.href = response.url; // Redirecionar para a página de login após logout
  } catch (error) {
    console.error("Erro de rede", error);
  }
};

buscarDados();
