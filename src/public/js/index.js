const socket = io();

chatBox.addEventListener('keyup', evt=>{
    console.log('keyup', evt.key);
    if(evt.key==="Enter"){
        if(chatBox.value.trim().length>0){
            socket.emit("message", {user:user, message: chatBox.value});
            chatBox.value="";
        }
    }
});
/*
socket.on('messageLogs', data=>{
    let log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach(message => {
        messages = messages + `${message.user} diz: ${message.message}<br/>`;
    });

    log.innerHTML = messages;
})*/

document.addEventListener('DOMContentLoadedsss', () => {
   // console.log("Ok aconteceu");
  //  socket.emit("message", {user:"carlos", message: "teste"});
   /* socket.on('messageLogs', data => {

       

        console.log("Retorno", data)
        let log = document.getElementById('messageLogs');
        let messages = "";
        data.forEach(message => {
            messages = messages + `${message.title}, ${message.description}<br/>`;
        });
        
        log.innerHTML = messages;
    });*/

    let table = `<table>
    <thead>
        <tr>
            <th>Título</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>`;

// Adicionar linhas à tabela para cada produto
data.forEach(message => {
    table += `<tr>
        <td>${message.title}</td>
        <td>${message.description}</td>
    </tr>`;
});

table += `</tbody></table>`;

});

document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); // Certifique-se de que você tem a instância do socket.io conectada

    socket.on('messageLogs', data => {
        console.log("Retorno", data);
        let log = document.getElementById('messageLogs');

        // Criar tabela e cabeçalho
        let table = `<table>
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Descrição</th>
                </tr>
            </thead>
            <tbody>`;

        // Adicionar linhas à tabela para cada produto
        data.forEach(message => {
            table += `<tr>
                <td>${message.title}</td>
                <td>${message.description}</td>
            </tr>`;
        });

        table += `</tbody></table>`;

        // Exibir tabela
        log.innerHTML = table;
    });

    socket.on('connect', () => {
        console.log('Connected to server');
    });
});