const express = require("express");
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middleware/auth-middleware");

const router = express.Router();

router.get("/login", userController.getLoginPage);
router.get("/register", userController.getRegisterPage);
router.get("/current", authMiddleware, userController.getCurrentUser);

module.exports = router;
