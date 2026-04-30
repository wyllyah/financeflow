const { z } = require("zod");
const prisma = require("../lib/prisma");

const updateProfileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
});

async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    }

    return res.json({ user });
  } catch {
    return res.status(500).json({
      message: "Erro ao buscar perfil.",
    });
  }
}

async function updateProfile(req, res) {
  try {
    const { name } = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return res.json({
      message: "Perfil atualizado com sucesso.",
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados inválidos.",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Erro ao atualizar perfil.",
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
