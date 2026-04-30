const { Router } = require("express");
const {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.get("/me", authMiddleware, me);

module.exports = authRoutes;
