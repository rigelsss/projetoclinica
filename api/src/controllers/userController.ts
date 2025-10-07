import { Request, Response } from "express";
import userService from "../services/userService";
import { Paciente, Medico, Funcionario } from "../generated/prisma";

const CPF_REGEX = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
const DOB_REGEX = /^\d{4}\-\d{2}\-\d{2}$/;
const ONLY_DIGITS = /^\d+$/;

function parseId(idRaw: string): number | null {
  const id = Number.parseInt(idRaw, 10);
  return Number.isNaN(id) || id <= 0 ? null : id;
}

const userController = {
  //GETALL Pacientes
  async getPacientes(req: Request, res: Response) {
    const pacientes: Paciente[] = await userService.getAllPacientes();
    res.status(200).json(pacientes);
  },

  //GETALL Medicos
  async getMedicos(req: Request, res: Response) {
    const medicos: Medico[] = await userService.getAllMedicos();
    res.status(200).json(medicos);
  },

  //GETALL Funcionarios
  async getFuncionarios(req: Request, res: Response) {
    const funcionarios: Funcionario[] = await userService.getAllFuncionarios();
    res.status(200).json(funcionarios);
  },

  //Get Paciente pelo ID
  async getPacienteById(req: Request, res: Response) {
    const id = parseId(req.params.id);
    //Validacao do parametro ID
    // 1) Garantir que veio number
    if (id === null) {
      res.status(400).json({ error: "O ID deve ser um número inteiro maior que zero" });
      return;
    }

    // 2) Buscar por ID no banco de dados
    const paciente = await userService.getPacienteById(id);

    // 3) Se não existir, retornar erro
    if (!paciente) {
      res.status(404).json({ error: "Paciente não encontrado para o ID fornecido" });
      return;
    }

    //Paciente encontrado
    res.status(200).json(paciente);
  },

  //Get Medico pelo ID
  async getMedicoById(req: Request, res: Response) {
    const id = parseId(req.params.id);
    //Validacao do ID
    // 1) Garantir que veio number
    if (id === null) {
      res.status(400).json({ error: "O ID deve ser um número inteiro maior que zero" });
      return;
    }

    // 2) Buscar por ID no banco de dados
    const medico = await userService.getMedicoById(id);

    // 3) Se não existir, retornar erro
    if (!medico) {
      res.status(404).json({ erro: "Medico não encontrado para o ID fornecido" });
      return;
    }

    //Medico encontrado
    res.status(200).json(medico);
  },

  //Get Funcionario pelo ID
  async getFuncionarioById(req: Request, res: Response) {
    const id = parseId(req.params.id);
    //Validacao do parametro ID
    // 1) Garantir que veio number
    if (id === null) {
      res.status(400).json({ error: "O ID deve ser um número inteiro maior que zero" });
      return;
    }

    // 2) Buscar por ID no banco de dados
    const funcionario = await userService.getFuncionarioById(id);

    // 3) Se não existir, retornar erro
    if (!funcionario) {
      res.status(404).json({ erro: "Funcionario não encontrado para o ID fornecido" });
      return;
    }

    //Funcionário encontrado
    res.status(200).json(funcionario);
  },

  //Create Paciente
  async createPaciente(req: Request, res: Response) {
    const { nome, idade, cpf, dob } = req.body;

    //Validacao de nome
    if (typeof nome !== "string" || nome.trim() === "") {
      return res.status(400).json({ erro: "Nome é obrigatório e deve ser uma string não vazia" });
    }

    //Validacao de idade
    if (typeof idade !== "number" || !Number.isInteger(idade) || idade <= 0) {
      return res.status(400).json({ erro: "Idade é obrigatória e deve ser um número inteiro maior que zero" });
    }

    //Validacao de CPF
    if (typeof cpf !== "string" || !CPF_REGEX.test(cpf)) {
      return res.status(400).json({ error: "CPF com formato inválido. Use o formato XXX.XXX.XXX-XX" });
    }

    // Unicidade de CPF
    if (await userService.existsPacienteByCPF(cpf)) {
      return res.status(400).json({ erro: "CPF já cadastrado" });
    }

    //Validacao de DOB
    if (typeof dob !== "string" || !DOB_REGEX.test(dob)) {
      return res.status(400).json({ erro: "DOB deve ser uma string no formato 'YYYY-MM-DD'" });
    }
    const dobDate = new Date(dob);
    if (Number.isNaN(dobDate.getTime())) {
      return res.status(400).json({ erro: "Data de nascimento inválida" });
    }

    try {
      const paciente = await userService.createPaciente({ nome, idade, cpf, dob: dobDate });
      res.status(201).json(paciente);
    } catch {
      res.status(500).json({ error: "Erro ao criar o paciente" });
    }
  },

  //Create Funcionario
  async createFuncionario(req: Request, res: Response) {
    const { nome, idade, cpf, dob } = req.body;

    //Validacao de nome
    if (typeof nome !== "string" || nome.trim() === "") {
      return res.status(400).json({ error: "Nome é obrigatório e deve ser uma string" });
    }

    //Validacao de idade
    if (typeof idade !== "number" || idade <= 0 || !Number.isInteger(idade)) {
      return res.status(400).json({ error: "Idade é obrigatória e deve ser maior que zero" });
    }

    //Validacao de CPF
    if (typeof cpf !== "string" || !CPF_REGEX.test(cpf)) {
      return res.status(400).json({ error: "CPF com formato inválido. Use o formato XXX.XXX.XXX-XX" });
    }

    // Unicidade de CPF
    if (await userService.existsFuncionarioByCPF(cpf)) {
      return res.status(400).json({ error: "CPF já cadastrado" });
    }

    //Validacao de dob
    if (typeof dob !== "string" || !DOB_REGEX.test(dob)) {
      return res.status(400).json({ error: "Use o formato YYYY-MM-DD" });
    }
    const dobDate = new Date(dob);
    if (Number.isNaN(dobDate.getTime())) {
      return res.status(400).json({ error: "Data de nascimento inválida" });
    }

    try {
      const funcionario = await userService.createFuncionario({ nome, idade, cpf, dob: dobDate });
      res.status(201).json(funcionario);
    } catch {
      res.status(500).json({ error: "Erro ao criar o funcionário" });
    }
  },

  //Create Medico
  async createMedico(req: Request, res: Response) {
    const { nome, idade, crm, cpf, dob } = req.body;

    //Validacao de nome
    if (typeof nome !== "string" || nome.trim() === "") {
      return res.status(400).json({ error: "Nome é obrigatório e deve ser uma string" });
    }

    //Validacao de idade
    if (typeof idade !== "number" || idade <= 0 || !Number.isInteger(idade)) {
      return res.status(400).json({ error: "Idade é obrigatória e deve ser um número maior que zero" });
    }

    //Validacao de CRM
    if (typeof crm !== "string" || !ONLY_DIGITS.test(crm)) {
      return res.status(400).json({ error: "CRM é obrigatório e deve conter apenas dígitos" });
    }

    //Verificação de CRM já cadastrado
    if (await userService.existsMedicoByCRM(crm)) {
      return res.status(400).json({ error: "CRM já cadastrado" });
    }

    //Validacao de CPF
    if (typeof cpf !== "string" || !CPF_REGEX.test(cpf)) {
      return res.status(400).json({ erro: "Use o formato XXX.XXX.XXX-XX para CPF" });
    }

    //Verificação de CPF já cadastrado
    if (await userService.existsMedicoByCPF(cpf)) {
      return res.status(400).json({ erro: "CPF já cadastrado" });
    }

    //Validacao de dob
    if (typeof dob !== "string" || !DOB_REGEX.test(dob)) {
      return res.status(400).json({ erro: "Use o formato YYYY-MM-DD para DOB" });
    }
    const dobDate = new Date(dob);
    if (Number.isNaN(dobDate.getTime())) {
      return res.status(400).json({ erro: "Data de nascimento inválida" });
    }

    try {
      const medico = await userService.createMedico({ nome, idade, crm, cpf, dob: dobDate });
      res.status(201).json(medico);
    } catch {
      res.status(500).json({ error: "Erro ao criar o médico" });
    }
  },

  //PUTFuncionario - Update Funcionario
  async updateFuncionario(req: Request, res: Response) {
    const id = parseId(req.params.id);

    // Prevenir requisição sem body ou body vazio
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Body vazio. Informe ao menos um campo para atualizar (nome, idade, cpf, dob)." });
    }

    //Validacao do ID fornecido
    if (id === null) {
      res.status(400).json({ error: "O ID do funcionário deve ser um número inteiro maior que zero" });
      return;
    }

    // Verificar se existe um funcionario com o ID fornecido
    const current = await userService.getFuncionarioById(id);
    if (!current) {
      return res.status(404).json({ error: "Funcionario não encontrado para o ID fornecido. Update não realizado" });
    }

    const { nome, idade, cpf, dob }: { nome?: string; idade?: number; cpf?: string; dob?: string } = req.body;
    const dataToUpdate: { nome?: string; idade?: number; cpf?: string; dob?: Date } = {};

    // Validacao de nome
    if (nome !== undefined) {
      if (typeof nome !== "string" || nome.trim() === "") {
        return res.status(400).json({ error: "O nome deve ser do tipo String e não pode ser vazio." });
      }
      dataToUpdate.nome = nome;
    }

    // Validacao de idade
    if (idade !== undefined) {
      if (typeof idade !== "number" || idade <= 0 || !Number.isInteger(idade)) {
        return res.status(400).json({ error: "A idade deve ser um número inteiro positivo" });
      }
      dataToUpdate.idade = idade;
    }

    // Validacao de CPF
    if (cpf !== undefined) {
      if (typeof cpf !== "string" || !CPF_REGEX.test(cpf)) {
        return res.status(400).json({ error: "CPF é obrigatório e deve ser uma string no formato 'XXX.XXX.XXX-XX'" });
      }
      dataToUpdate.cpf = cpf;
    }

    // Validacao de DOB
    if (dob !== undefined) {
      if (typeof dob !== "string" || !DOB_REGEX.test(dob)) {
        return res.status(400).json({ error: "Use o formato YYYY-MM-DD para DOB" });
      }
      const dobDate = new Date(dob);
      if (Number.isNaN(dobDate.getTime())) {
        return res.status(400).json({ error: "Data de nascimento inválida" });
      }
      dataToUpdate.dob = dobDate;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ error: "Nenhum dado para atualizar foi fornecido" });
    }

    try {
      const funcionario = await userService.updateFuncionario(id, dataToUpdate);
      res.status(200).json(funcionario);
    } catch {
      return res.status(500).json({ error: "Erro ao atualizar o funcionário" });
    }
  },

  //PUTPaciente - Update Paciente
  async updatePaciente(req: Request, res: Response) {
    const id = parseId(req.params.id);

    // Prevenir requisição sem body ou body vazio
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Body vazio. Informe ao menos um campo para atualizar (nome, idade, cpf, dob)." });
    }

    //Validacao do ID fornecido
    if (id === null) {
      res.status(400).json({ error: "O ID do paciente deve ser um número inteiro maior que zero" });
      return;
    }

    // Verificar se existe um paciente com o ID fornecido
    const current = await userService.getPacienteById(id);
    if (!current) {
      return res.status(404).json({ error: "Paciente não encontrado para o ID fornecido. Update não realizado" });
    }

    const { nome, idade, cpf, dob }: { nome?: string; idade?: number; cpf?: string; dob?: string } = req.body;
    const dataToUpdate: { nome?: string; idade?: number; cpf?: string; dob?: Date } = {};

    // Validacao de nome
    if (nome !== undefined) {
      if (typeof nome !== "string" || nome.trim() === "") {
        return res.status(400).json({ error: "O nome deve ser do tipo String e não pode ser vazio." });
      }
      dataToUpdate.nome = nome;
    }

    // Validacao de idade
    if (idade !== undefined) {
      if (typeof idade !== "number" || idade <= 0 || !Number.isInteger(idade)) {
        return res.status(400).json({ error: "A idade deve ser um número inteiro positivo" });
      }
      dataToUpdate.idade = idade;
    }

    // Validacao de CPF
    if (cpf !== undefined) {
      if (typeof cpf !== "string" || !CPF_REGEX.test(cpf)) {
        return res.status(400).json({ error: "CPF é obrigatório e deve ser uma string no formato 'XXX.XXX.XXX-XX'" });
      }
      dataToUpdate.cpf = cpf;
    }

    // Validacao de DOB
    if (dob !== undefined) {
      if (typeof dob !== "string" || !DOB_REGEX.test(dob)) {
        return res.status(400).json({ error: "Use o formato YYYY-MM-DD para DOB" });
      }
      const dobDate = new Date(dob);
      if (Number.isNaN(dobDate.getTime())) {
        return res.status(400).json({ error: "Data de nascimento inválida" });
      }
      dataToUpdate.dob = dobDate;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ error: "Nenhum dado para atualizar foi fornecido" });
    }

    try {
      const paciente = await userService.updatePaciente(id, dataToUpdate);
      res.status(200).json(paciente);
    } catch {
      return res.status(500).json({ error: "Erro ao atualizar o paciente" });
    }
  },

  //PUTMedico - Update Medico
  async updateMedico(req: Request, res: Response) {
    const id = parseId(req.params.id);

    // Prevenir requisição sem body ou body vazio
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Body vazio. Informe ao menos um campo para atualizar (nome, idade, cpf, crm, dob)." });
    }

    //Validacao do ID fornecido
    if (id === null) {
      res.status(400).json({ error: "O ID do médico deve ser um número inteiro maior que zero" });
      return;
    }

    // Verificar se existe um medico com o ID fornecido
    const current = await userService.getMedicoById(id);
    if (!current) {
      return res.status(404).json({ error: "Medico não encontrado para o ID fornecido. Update não realizado" });
    }

    const { nome, idade, crm, cpf, dob }: { nome?: string; idade?: number; crm?: string; cpf?: string; dob?: string } = req.body;
    const dataToUpdate: { nome?: string; idade?: number; crm?: string; cpf?: string; dob?: Date } = {};

    // Validacao de nome
    if (nome !== undefined) {
      if (typeof nome !== "string" || nome.trim() === "") {
        return res.status(400).json({ error: "O nome deve ser do tipo String e não pode ser vazio." });
      }
      dataToUpdate.nome = nome;
    }

    // Validacao de idade
    if (idade !== undefined) {
      if (typeof idade !== "number" || idade <= 0 || !Number.isInteger(idade)) {
        return res.status(400).json({ error: "A idade deve ser um número inteiro positivo" });
      }
      dataToUpdate.idade = idade;
    }

    // Validacao de CPF
    if (cpf !== undefined) {
      if (typeof cpf !== "string" || !CPF_REGEX.test(cpf)) {
        return res.status(400).json({ error: "CPF é obrigatório e deve ser uma string no formato 'XXX.XXX.XXX-XX'" });
      }
      dataToUpdate.cpf = cpf;
    }

    // Validacao de CRM
    if (crm !== undefined) {
      if (typeof crm !== "string" || !ONLY_DIGITS.test(crm)) {
        return res.status(400).json({ error: "O CRM deve ser uma string numérica (apenas dígitos)" });
      }
      dataToUpdate.crm = crm;
    }

    // Validacao de DOB
    if (dob !== undefined) {
      if (typeof dob !== "string" || !DOB_REGEX.test(dob)) {
        return res.status(400).json({ error: "Use o formato YYYY-MM-DD para DOB" });
      }
      const dobDate = new Date(dob);
      if (Number.isNaN(dobDate.getTime())) {
        return res.status(400).json({ error: "Data de nascimento inválida" });
      }
      dataToUpdate.dob = dobDate;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ error: "Nenhum dado para atualizar foi fornecido" });
    }

    try {
      const medico = await userService.updateMedico(id, dataToUpdate);
      res.status(200).json(medico);
    } catch {
      return res.status(500).json({ error: "Erro ao atualizar o médico" });
    }
  },

  //DELETE FuncionarioByID
  async deleteFuncionario(req: Request, res: Response) {
    const id = parseId(req.params.id);
    //Validacao do ID
    if (id === null) {
      res.status(400).json({ error: "O ID deve ser um número inteiro maior que zero" });
      return;
    }

    try {
      await userService.deleteFuncionario(id);
      res.status(204).send();
    } catch {
      res.status(404).json({ error: "O ID do Funcionario não foi encontrado" });
    }
  },

  //DELETE Paciente ByID
  async deletePaciente(req: Request, res: Response) {
    const id = parseId(req.params.id);
    //Validacao de ID
    if (id === null) {
      res.status(400).json({ error: "O ID deve ser um número inteiro maior que zero" });
      return;
    }

    try {
      await userService.deletePaciente(id);
      res.status(204).send();
    } catch {
      res.status(404).json({ error: "O ID do Paciente não foi encontrado" });
    }
  },

  //DELETE Medico ByID
  async deleteMedico(req: Request, res: Response) {
    const id = parseId(req.params.id);
    //Validacao de ID
    if (id === null) {
      res.status(400).json({ error: "O ID deve ser um número inteiro maior que zero" });
      return;
    }

    try {
      await userService.deleteMedico(id);
      res.status(204).send();
    } catch {
      res.status(404).json({ error: "O ID do Medico não foi encontrado" });
    }
  },
};

export default userController;
