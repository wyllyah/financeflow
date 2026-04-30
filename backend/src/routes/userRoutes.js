const { Router } = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.get("/profile", getProfile);
userRoutes.put("/profile", updateProfile);

module.exports = userRoutes;
