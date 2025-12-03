import { Router, Request, Response, NextFunction } from "express";
import userController from "../controllers/userController";

// IMPORTS para autenticação
import { z } from "zod";
import bcrypt from "bcryptjs";
// ATENÇÃO: seu Prisma Client está com output customizado em ../src/generated/prisma
// Como este arquivo fica em src/routes, o import correto é:
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
const router = Router();

/** *******************************
 * ZOD SCHEMAS (auth)
 *********************************/
const loginBody = z.object({
  email: z.string().email(),
  senha: z.string().min(4),
});

const registerBody = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  email: z.string().email(),
  senha: z.string().min(4, "Senha deve ter pelo menos 4 caracteres"),
  cpf: z.string().optional(),
  telefone: z.string().optional(),
});

/** *******************************
 * HELPERS (auth)
 *********************************/
type UsuarioDTO = {
  id: number;
  nome: string;
  email: string;
};

function toUsuarioDTO(u: { id: number; nome: string; email: string }): UsuarioDTO {
  return { id: u.id, nome: u.nome, email: u.email };
}

/** *******************************
 * ROTAS DE AUTENTICAÇÃO
 *********************************/

/**
 * POST /login
 * body: { email, senha }
 * resp: { id, nome, email } em caso de sucesso
 */
router.post("/login", async (req: Request, res: Response) => {
  const parsed = loginBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const { senha } = parsed.data;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      select: { id: true, nome: true, email: true, senhaHash: true },
    });

    if (!usuario) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const ok = await bcrypt.compare(senha, usuario.senhaHash);
    if (!ok) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    return res.json(toUsuarioDTO(usuario));
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ message: "Erro interno ao realizar login" });
  }
});

/**
 * POST /register
 * body: { nome, email, senha, cpf?, telefone? }
 * resp: { id, nome, email } em caso de sucesso (201)
 */
router.post("/register", async (req: Request, res: Response) => {
  const parsed = registerBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  const { nome, senha, cpf, telefone } = parsed.data;
  const email = parsed.data.email.toLowerCase().trim();

  try {
    const exists = await prisma.usuario.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novo = await prisma.usuario.create({
      data: { nome, email, senhaHash, cpf, telefone },
      select: { id: true, nome: true, email: true },
    });

    return res.status(201).json(toUsuarioDTO(novo));
  } catch (err: any) {
    console.error("Erro no register:", err);

    // Trata violação de unique do CPF (se informado)
    if (err?.code === "P2002" && Array.isArray(err?.meta?.target)) {
      const target: string[] = err.meta.target;
      if (target.includes("email")) {
        return res.status(409).json({ message: "Email já cadastrado" });
      }
      if (target.includes("cpf")) {
        return res.status(409).json({ message: "CPF já cadastrado" });
      }
    }

    return res.status(500).json({ message: "Erro interno ao registrar usuário" });
  }
});

/** *******************************
 * SUAS ROTAS EXISTENTES (CRUDs)
 *********************************/

// Rotas GET (coleções)
router.get("/funcionarios", userController.getFuncionarios);
router.get("/pacientes", userController.getPacientes);
router.get("/medicos", userController.getMedicos);

// Rotas GET (por ID)
router.get("/funcionarios/:id", userController.getFuncionarioById);
router.get("/pacientes/:id", userController.getPacienteById);
router.get("/medicos/:id", userController.getMedicoById);

// Rotas POST (criação)
router.post("/funcionarios", userController.createFuncionario);
router.post("/pacientes", userController.createPaciente);
router.post("/medicos", userController.createMedico);

// Rotas PUT (atualização parcial/total)
router.put("/funcionarios/:id", userController.updateFuncionario);
router.put("/pacientes/:id", userController.updatePaciente);
router.put("/medicos/:id", userController.updateMedico);

// Rotas DELETE (remoção)
router.delete("/funcionarios/:id", userController.deleteFuncionario);
router.delete("/pacientes/:id", userController.deletePaciente);
router.delete("/medicos/:id", userController.deleteMedico);

export default router;
