const { z } = require("zod");
const prisma = require("../lib/prisma");

const transactionSchema = z
  .object({
    title: z.string().min(1, "Título obrigatório."),
    amount: z.number().positive("O valor deve ser maior que zero."),
    type: z.enum(["INCOME", "EXPENSE"]),
    category: z.string().optional(),
    categoryId: z.string().optional(),
    date: z.string().min(1, "Data obrigatória."),
    description: z.string().optional(),
  })
  .superRefine((data, context) => {
    if (!data.categoryId && !data.category?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["category"],
        message: "Categoria obrigatória.",
      });
    }
  });

async function resolveCategory({ categoryId, type, userId }) {
  if (!categoryId) {
    return null;
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
    },
  });

  if (!category) {
    return {
      error: {
        status: 404,
        body: { message: "Categoria não encontrada." },
      },
    };
  }

  if (category.type !== type) {
    return {
      error: {
        status: 400,
        body: { message: "Categoria incompatível com o tipo da transação." },
      },
    };
  }

  return { category };
}

async function createTransaction(req, res) {
  try {
    const data = transactionSchema.parse(req.body);
    const resolvedCategory = await resolveCategory({
      categoryId: data.categoryId,
      type: data.type,
      userId: req.userId,
    });

    if (resolvedCategory?.error) {
      return res
        .status(resolvedCategory.error.status)
        .json(resolvedCategory.error.body);
    }

    const transaction = await prisma.transaction.create({
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: resolvedCategory?.category?.name || data.category,
        categoryId: resolvedCategory?.category?.id,
        date: new Date(data.date),
        description: data.description,
        userId: req.userId,
      },
      include: {
        categoryRef: true,
      },
    });

    return res.status(201).json({
      message: "Transação criada com sucesso.",
      transaction,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados inválidos.",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Erro ao criar transação.",
    });
  }
}

async function listTransactions(req, res) {
  try {
    const {
      type,
      month,
      year,
      categoryId,
      search,
      startDate,
      endDate,
      sortBy,
      order,
    } = req.query;

    const filters = {
      userId: req.userId,
    };

    if (type && ["INCOME", "EXPENSE"].includes(type)) {
      filters.type = type;
    }

    if (categoryId) {
      filters.categoryId = categoryId;
    }

    if (search) {
      filters.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (startDate || endDate) {
      filters.date = {};

      if (startDate) {
        filters.date.gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        filters.date.lt = end;
      }
    } else if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 1);

      filters.date = {
        gte: start,
        lt: end,
      };
    }

    const allowedSortFields = ["date", "amount", "title"];
    const orderBy = {
      [allowedSortFields.includes(sortBy) ? sortBy : "date"]:
        order === "asc" ? "asc" : "desc",
    };

    const transactions = await prisma.transaction.findMany({
      where: filters,
      orderBy,
      include: {
        categoryRef: true,
      },
    });

    return res.json({ transactions });
  } catch {
    return res.status(500).json({
      message: "Erro ao listar transações.",
    });
  }
}

async function getTransactionById(req, res) {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.userId,
      },
      include: {
        categoryRef: true,
      },
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transação não encontrada.",
      });
    }

    return res.json({ transaction });
  } catch {
    return res.status(500).json({
      message: "Erro ao buscar transação.",
    });
  }
}

async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    const data = transactionSchema.parse(req.body);

    const transactionExists = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!transactionExists) {
      return res.status(404).json({
        message: "Transação não encontrada.",
      });
    }

    const resolvedCategory = await resolveCategory({
      categoryId: data.categoryId,
      type: data.type,
      userId: req.userId,
    });

    if (resolvedCategory?.error) {
      return res
        .status(resolvedCategory.error.status)
        .json(resolvedCategory.error.body);
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: resolvedCategory?.category?.name || data.category,
        categoryId: resolvedCategory?.category?.id || null,
        date: new Date(data.date),
        description: data.description,
      },
      include: {
        categoryRef: true,
      },
    });

    return res.json({
      message: "Transação atualizada com sucesso.",
      transaction,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados inválidos.",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Erro ao atualizar transação.",
    });
  }
}

async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    const transactionExists = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!transactionExists) {
      return res.status(404).json({
        message: "Transação não encontrada.",
      });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return res.json({
      message: "Transação excluída com sucesso.",
    });
  } catch {
    return res.status(500).json({
      message: "Erro ao excluir transação.",
    });
  }
}

module.exports = {
  createTransaction,
  listTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
