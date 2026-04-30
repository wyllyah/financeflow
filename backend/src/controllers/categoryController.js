const { z } = require("zod");
const prisma = require("../lib/prisma");

const categorySchema = z.object({
  name: z.string().min(1, "Nome obrigatório."),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().optional(),
  icon: z.string().optional(),
});

async function createCategory(req, res) {
  try {
    const data = categorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
        color: data.color,
        icon: data.icon,
        userId: req.userId,
      },
    });

    return res.status(201).json({
      message: "Categoria criada com sucesso.",
      category,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados inválidos.",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Erro ao criar categoria.",
    });
  }
}

async function listCategories(req, res) {
  try {
    const { type } = req.query;

    const where = {
      userId: req.userId,
    };

    if (type && ["INCOME", "EXPENSE"].includes(type)) {
      where.type = type;
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    return res.json({ categories });
  } catch {
    return res.status(500).json({
      message: "Erro ao listar categorias.",
    });
  }
}

async function getCategoryById(req, res) {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Categoria não encontrada.",
      });
    }

    return res.json({ category });
  } catch {
    return res.status(500).json({
      message: "Erro ao buscar categoria.",
    });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const data = categorySchema.parse(req.body);

    const categoryExists = await prisma.category.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!categoryExists) {
      return res.status(404).json({
        message: "Categoria não encontrada.",
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        color: data.color,
        icon: data.icon,
      },
    });

    return res.json({
      message: "Categoria atualizada com sucesso.",
      category,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados inválidos.",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Erro ao atualizar categoria.",
    });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const categoryExists = await prisma.category.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!categoryExists) {
      return res.status(404).json({
        message: "Categoria não encontrada.",
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    return res.json({
      message: "Categoria excluída com sucesso.",
    });
  } catch {
    return res.status(500).json({
      message: "Erro ao excluir categoria.",
    });
  }
}

module.exports = {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
