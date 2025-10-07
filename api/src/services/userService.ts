import prisma from "../db/prisma";
import { Paciente, Funcionario, Medico } from "../generated/prisma";

type CreatePacienteInput = { nome: string; idade: number; cpf: string; dob: Date };
type CreateFuncionarioInput = { nome: string; idade: number; cpf: string; dob: Date };
type CreateMedicoInput = { nome: string; idade: number; cpf: string; crm: string; dob: Date };

type UpdatePacienteInput = Partial<CreatePacienteInput>;
type UpdateFuncionarioInput = Partial<CreateFuncionarioInput>;
type UpdateMedicoInput = Partial<CreateMedicoInput>;

const userService = {
  //Get all funcionarios
  async getAllFuncionarios(): Promise<Funcionario[]> {
    return prisma.funcionario.findMany();
  },

  //Get all pacientes
  async getAllPacientes(): Promise<Paciente[]> {
    return prisma.paciente.findMany();
  },

  //Get all medicos
  async getAllMedicos(): Promise<Medico[]> {
    return prisma.medico.findMany();
  },

  //Get one funcionario by ID
  async getFuncionarioById(id: number): Promise<Funcionario | null> {
    return prisma.funcionario.findUnique({ where: { id } });
  },

  //Get one paciente by ID
  async getPacienteById(id: number): Promise<Paciente | null> {
    return prisma.paciente.findUnique({ where: { id } });
  },

  //Get one medico by ID
  async getMedicoById(id: number): Promise<Medico | null> {
    return prisma.medico.findUnique({ where: { id } });
  },

  //Create um funcionario
  async createFuncionario(data: CreateFuncionarioInput): Promise<Funcionario> {
    return prisma.funcionario.create({ data });
  },

  //Create um paciente
  async createPaciente(data: CreatePacienteInput): Promise<Paciente> {
    return prisma.paciente.create({ data });
  },

  //Create um medico
  async createMedico(data: CreateMedicoInput): Promise<Medico> {
    return prisma.medico.create({ data });
  },

  //Update Funcionario
  async updateFuncionario(id: number, data: UpdateFuncionarioInput): Promise<Funcionario> {
    return prisma.funcionario.update({ where: { id }, data });
  },

  //Update Paciente
  async updatePaciente(id: number, data: UpdatePacienteInput): Promise<Paciente> {
    return prisma.paciente.update({ where: { id }, data });
  },

  //Update Medico
  async updateMedico(id: number, data: UpdateMedicoInput): Promise<Medico> {
    return prisma.medico.update({ where: { id }, data });
  },

  //Delete Funcionario
  async deleteFuncionario(id: number): Promise<void> {
    await prisma.funcionario.delete({ where: { id } });
  },

  //Delete Paciente
  async deletePaciente(id: number): Promise<void> {
    await prisma.paciente.delete({ where: { id } });
  },

  //Delete Medico
  async deleteMedico(id: number): Promise<void> {
    await prisma.medico.delete({ where: { id } });
  },

  // Helpers de unicidade
  async existsFuncionarioByCPF(cpf: string): Promise<boolean> {
    const exists = await prisma.funcionario.findUnique({ where: { cpf } });
    return !!exists;
  },
  async existsPacienteByCPF(cpf: string): Promise<boolean> {
    const exists = await prisma.paciente.findUnique({ where: { cpf } });
    return !!exists;
  },
  async existsMedicoByCPF(cpf: string): Promise<boolean> {
    const exists = await prisma.medico.findUnique({ where: { cpf } });
    return !!exists;
  },
  async existsMedicoByCRM(crm: string): Promise<boolean> {
    const found = await prisma.medico.findUnique({ where: { crm } });
    return !!found;
  },
};

export default userService;
