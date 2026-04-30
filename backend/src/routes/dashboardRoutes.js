const { Router } = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getDashboard } = require("../controllers/dashboardController");

const dashboardRoutes = Router();

dashboardRoutes.use(authMiddleware);

dashboardRoutes.get("/", getDashboard);

module.exports = dashboardRoutes;