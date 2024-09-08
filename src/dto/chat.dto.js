class ChatDTO {
    constructor(message) {
        this.userEmail = message.userEmail;
        this.userName = message.userName;
        this.message = message.message;
      }
}

module.exports = ChatDTO;