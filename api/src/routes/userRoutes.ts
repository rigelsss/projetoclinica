import { Router, Request, Response, NextFunction } from "express";
import userController from "../controllers/userController";

const router = Router();

// Middleware simples para log/diagnóstico (opcional)
// router.use((req, _res, next) => { console.log(`${req.method} ${req.path}`); next(); });

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
