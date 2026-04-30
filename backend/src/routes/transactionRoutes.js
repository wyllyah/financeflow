const { Router } = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  createTransaction,
  listTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const transactionRoutes = Router();

transactionRoutes.use(authMiddleware);

transactionRoutes.post("/", createTransaction);
transactionRoutes.get("/", listTransactions);
transactionRoutes.get("/:id", getTransactionById);
transactionRoutes.put("/:id", updateTransaction);
transactionRoutes.delete("/:id", deleteTransaction);

module.exports = transactionRoutes;