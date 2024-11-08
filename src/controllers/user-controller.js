const sendEmail = require("../config/sendEmail.js");
const User = require("../dao/models/user.model.js");
const UserDTO = require("../dto/user.dto");

const { factory } = require("./../dao/factory.js");
const { userRepository } = factory();


const getLoginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect("/products");
  }
  res.render("login", { style: "login.css" });
};

const getRegisterPage = (req, res) => {
  if (req.session.user) {
    return res.redirect("/products");
  }
  res.render("register", { style: "register.css" });
};

// Função para obter o usuário atual
const getCurrentUser = (req, res) => {
  if (req.user) {
    const userDTO = new UserDTO(req.user); // Converte o usuário em um DTO
    return res.json(userDTO); // Envia as informações necessárias
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const getUser = async (req, res) => {
  
  try {
    const users = await userRepository.getAll();
    const dados = users.map(user => ({
      nome: user.first_name + ' ' + user.last_name,
      email: user.email,
      tipo_conta: user.role
    }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteInactiveUsers = async (req, res) => {
  
  try {

    let count = 0;
    const users = await userRepository.getAll();
    users.forEach(user => {
      if (diffInDays(user.last_accessed, new Date()) >= 2) {
        //this.delete(user.id)
        sendEmail(true, '', user.email);
        count++;
      }  
    });

    


    
    

    res.status(200).json(`${count} usuário(s) excluído(s)`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const diffInDays = (date1, date2) => {
  // Convertemos as datas em milissegundos
  const timeDiff = Math.abs(date2 - date1);
  // Dividimos pela quantidade de milissegundos em um dia e subtraímos 2
  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) - 2;
  return diffDays > 0 ? diffDays : 0; // Garantimos que não retorne um valor negativo
}

module.exports = {
  getCurrentUser,
};

module.exports = {
  getLoginPage,
  getRegisterPage,
  getCurrentUser,
  getUser,
  deleteInactiveUsers
};
