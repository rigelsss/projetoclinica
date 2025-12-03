import { api } from './api';
import type { Usuario } from '../types/usuario';

export async function login(email: string, senha: string): Promise<Usuario> {
  const { data } = await api.post<Usuario>('/login', { email, senha });
  return data;
}

export async function register(payload: {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  telefone?: string;
}): Promise<Usuario> {
  const { data } = await api.post<Usuario>('/register', payload);
  return data;
}
