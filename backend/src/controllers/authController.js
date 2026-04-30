const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const prisma = require("../lib/prisma");

const registerSchema = z.object({
  name: z.string().min(2, "Nome obrigatório."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Senha obrigatória."),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido."),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token obrigatório."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

const genericForgotPasswordMessage =
  "Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.";

function buildResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  return {
    token,
    tokenHash,
    expiresAt,
  };
}

async function register(req, res) {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso.",
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
      message: "Erro ao cadastrar usuário.",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      message: "Login realizado com sucesso.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados inválidos.",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Erro ao fazer login.",
    });
  }
}

async function me(req, res) {
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
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.json({ user });
  } catch {
    return res.status(500).json({
      message: "Erro ao buscar usuário.",
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return res.json({
        message: genericForgotPasswordMessage,
      });
    }

    const { token, tokenHash, expiresAt } = buildResetToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: tokenHash,
        resetTokenExpires: expiresAt,
      },
    });

    const response = {
      message: genericForgotPasswordMessage,
    };

    if (process.env.NODE_ENV !== "production") {
      response.resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    }

    return res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados inválidos.",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Erro ao solicitar recuperação de senha.",
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetTokenHash: tokenHash,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token inválido ou expirado.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetTokenHash: null,
        resetTokenExpires: null,
      },
    });

    return res.json({
      message: "Senha redefinida com sucesso.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Dados inválidos.",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Erro ao redefinir senha.",
    });
  }
}

module.exports = {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
};
