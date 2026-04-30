const { Router } = require("express");
const {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");

const categoryRoutes = Router();

categoryRoutes.use(authMiddleware);

categoryRoutes.get("/", listCategories);
categoryRoutes.post("/", createCategory);
categoryRoutes.get("/:id", getCategoryById);
categoryRoutes.put("/:id", updateCategory);
categoryRoutes.delete("/:id", deleteCategory);

module.exports = categoryRoutes;
