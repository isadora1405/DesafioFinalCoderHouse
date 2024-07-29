const express = require("express");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.get("/login", userController.getLoginPage);
router.get("/register", userController.getRegisterPage);

module.exports = router;
