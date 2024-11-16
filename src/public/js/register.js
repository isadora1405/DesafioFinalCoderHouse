document.querySelector('.register-form').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevenir o comportamento padrão
  
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries()); // Converte os dados do formulário em objeto

  try {
    console.log("Endpoint", form.action)
    const response = await fetch(form.action, {
      method: form.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    console.log("REsponse ok", response)
    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Cadastro!",
        text: "Usuário cadastrado com sucesso.",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        location.reload();
      });
    } else {
      const error = await response.json();
        let mensagem = 'Erro ao cadastrar usuário';
    //    console.log("Error", erro)
        if (response.status === 409) {
          mensagem = 'Email já cadastrado para outra conta.'
        }
          Swal.fire({
            icon: "error",
            title: "Erro!",
            text: mensagem,
          });
    }
  } catch (error) {
    let mensagem = 'Erro ao cadastrar usuário';
   
    if (response.status === 409) {
      mensagem = 'Email já cadastrado para outra conta.'
    }

    
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: mensagem,
    });
  }
});
