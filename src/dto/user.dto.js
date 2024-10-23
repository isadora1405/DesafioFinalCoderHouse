class UserDTO {
  constructor(user) {
    this.name = user.name;
    this.lastName = user.lastName;
    this.age = user.age;
    this.role = user.role;
  }
}

module.exports = UserDTO;
