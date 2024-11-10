const sendEmail = require("../config/sendEmail.js");
const User = require("../dao/models/user.model.js");
const UserDTO = require("../dto/user.dto");
const logger = require("./../utils/logger.js");

const { factory } = require("./../dao/factory.js");
const { userRepository } = factory();


const getLoginPage = (req, res) => {
  if (req.session.user) {
    logger.info("Usuário já logado, redirecionando para a página de produtos.");
    return res.redirect("/products");
  }
  logger.info("Renderizando a página de login.");
  res.render("login", { style: "login.css" });
};

const getRegisterPage = (req, res) => {
  if (req.session.user) {
    logger.info("Usuário já logado, redirecionando para a página de produtos.");
    return res.redirect("/products");
  }
  logger.info("Renderizando a página de registro.");
  res.render("register", { style: "register.css" });
};

const getCurrentUser = (req, res) => {
  if (req.session.user) {
    const userDTO = new UserDTO(req.session.user);
    logger.info("Retornando informações do usuário logado.");
    return res.json(userDTO);
  } else {
    logger.warning(
      "Tentativa de acesso a informações do usuário sem autenticação."
    );
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const getUser = async (req, res) => {
  const query = definirQuery(req.query);

  const options = {
    page: req.query.page ? parseInt(req.query.page) : 1,
    limit: req.query.limit ? parseInt(req.query.limit) : 10,
    sort: req.query.sort ? { first_name: 1 } : {}, // Ordenação por preço
    select: 'first_name last_name email age cartId role last_accessed',
  };

  try {
    const users = await userRepository.paginate(query, options);
    
    users.payload = users.docs;
    delete users.docs;

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteUser = async (req, res) => {
  let { pid } = req.params;

  try {
    await userRepository.delete(pid);
    
    res.status(200).json("Usuário excluído com sucesso.");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRole = async (req, res) => {
  let { pid, prole } = req.params;

  const user = {
    _id: pid,
    role: prole
  }
  try {
    await userRepository.update(pid, user);
    
    res.status(200).json("Perfil do usuário atualizado com sucesso.");
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
        this.delete(user.id)
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


function definirQuery(query) {
  const { category, disponibilidade }  = query;
  let dados = {};
  if (category) {
    dados.category = category
  }
  
  if (disponibilidade) {
    dados.status = disponibilidade;
  }

  return dados;
}

function definirOrdem(valor) {
  if (valor === 'desc') {
    return -1;
  }

  return 1;
}

module.exports = {
  getLoginPage,
  getRegisterPage,
  getCurrentUser,
  getUser,
  deleteInactiveUsers,
  deleteUser,
  updateRole,
};
