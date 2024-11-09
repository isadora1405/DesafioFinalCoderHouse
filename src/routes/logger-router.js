const express = require("express");
const logger = require("./../utils/logger.js");

const router = express.Router();

router.get("/loggerTest", (req, res) => {
  logger.fatal("Esse é um log de nível FATAL - problemas críticos!");
  logger.error("Esse é um log de nível ERROR - algo deu errado!");
  logger.warning("Esse é um log de nível WARNING - alerta para atenção!");
  logger.info("Esse é um log de nível INFO - informações gerais.");
  logger.http("Esse é um log de nível HTTP - requisições HTTP registradas.");
  logger.debug(
    "Esse é um log de nível DEBUG - informações detalhadas para depuração."
  );

  res.send(
    "Testando todos os níveis de log! Verifique o console ou o arquivo de logs."
  );
});

module.exports = router;
