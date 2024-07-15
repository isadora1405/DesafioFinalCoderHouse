const sendMessage = async (userEmail, message, userName) => {
  const response = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail, message, userName }),
  });

  const data = await response.json();
};

const socket = io();

let user;
let userName = "";

Swal.fire({
  title: "Identificar",
  html:
    '<input id="swal-input1" class="swal2-input" placeholder="Email">' +
    '<input id="swal-input2" class="swal2-input" placeholder="Nome">',
  preConfirm: () => {
    const email = document.getElementById("swal-input1").value;
    userName = document.getElementById("swal-input2").value;
    user = email;
  },
  allowOutsideClick: false,
}).then(() => {
  const chatBox = document.getElementById("chatBox");
  chatBox.addEventListener("keyup", async (evt) => {
    if (evt.key === "Enter") {
      if (chatBox.value.trim().length > 0) {
        const data = { user: user, message: chatBox.value, userNameame: userName };
        await sendMessage(user, chatBox.value, userName);
        socket.emit("mensagem-chat", data);
        chatBox.value = "";
      }
    }
  });
});

socket.on("historico-mensagens", (data) => {
  let newMessage = '';
  data.forEach(element => {
    newMessage += `${element.userName} diz: ${element.message}<br/>`;
  });
  let log = document.getElementById("messageLogs");
 
  log.innerHTML += newMessage;
});
