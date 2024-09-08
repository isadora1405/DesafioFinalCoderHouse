export default class ChatDTO {
    constructor(message) {
        this.userEmail = message.userEmail;
        this.userName = message.userName;
        this.message = message.message;
        this.timestamp = message.timestamp || new Date(); // Valor padrão como `Date.now`
      }
}