const express = require("express");
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middleware/auth-middleware");

const router = express.Router();

router.get("/login", userController.getLoginPage);
router.get("/register", userController.getRegisterPage);
router.get("/current", authMiddleware, userController.getCurrentUser);

router.get("/", userController.getUser);
router.delete("/", userController.deleteInactiveUsers);
router.delete("/:pid", userController.deleteUser);
router.put("/:pid/:prole", userController.updateRole);

module.exports = router;
