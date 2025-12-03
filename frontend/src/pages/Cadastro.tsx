import React from "react";
import {
  TextField,
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { z } from "zod";
import { register as registerApi } from "../services/authService"; 

type InputEvt = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type BlurEvt = React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>;
const onlyDigits = (s: string) => s.replace(/[^\d]/g, "");

// Formata CPF para XXX.XXX.XXX-XX
function formatCPF(digits: string): string {
  const v = onlyDigits(digits).slice(0, 11);
  if (v.length <= 3) return v;
  if (v.length <= 6) return `${v.slice(0, 3)}.${v.slice(3)}`;
  if (v.length <= 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
  return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
}

// Formata celular BR (11 dígitos) — (DD) 9 XXXX-XXXX
function formatPhoneBR(digits: string): string {
  const numero = onlyDigits(digits).slice(0, 11);
  if (numero.length === 0) return "";
  if (numero.length <= 2) return `(${numero}`;
  if (numero.length <= 3) return `(${numero.slice(0, 2)}) ${numero.slice(2)}`;
  if (numero.length <= 7)
    return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(3)}`;
  return `(${numero.slice(0, 2)}) ${numero.slice(2, 3)} ${numero.slice(
    3,
    7
  )}-${numero.slice(7)}`;
}

// Validação simples de CPF (sem DV)
function isValidCPF(digits: string): boolean {
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  return true;
}

// Schemas
const nomeSchema = z
  .string()
  .trim()
  .min(3, "Nome muito curto")
  .refine((v) => v.split(/\s+/).length >= 2, {
    message: "Informe nome e sobrenome",
  })
  .refine((v) => v.split(/\s+/).every((p) => p.length >= 2), {
    message: "Cada parte deve ter pelo menos 2 letras",
  });

const cpfSchema = z
  .string()
  .trim()
  .transform(onlyDigits)
  .refine((v) => v.length === 11, "CPF deve ter 11 dígitos")
  .refine(isValidCPF, "CPF inválido");

const emailSchema = z.email("Email inválido");

const telefoneSchema = z
  .string()
  .trim()
  .transform(onlyDigits)
  .refine((v) => v.length === 11, "Telefone (DDD + número) deve ter 11 dígitos")
  .refine((v) => v.slice(0, 2) !== "00", "DDD inválido")
  .refine((v) => v[2] === "9", "Para celular, o número deve iniciar com 9");

const senhaSchema = z.string().min(4, "A senha deve ter pelo menos 4 caracteres");

// Schema do formulário com confirmação de senha
const registerSchema = z
  .object({
    nome: nomeSchema,
    email: emailSchema,
    cpf: cpfSchema,
    telefone: telefoneSchema,
    senha: senhaSchema,
    confirmarSenha: z.string(),
  })
  .refine((data) => data.confirmarSenha === data.senha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type FormValues = z.infer<typeof registerSchema>;
type FormErrors = Partial<Record<keyof FormValues, string | null>>;
type Touched = Partial<Record<keyof FormValues, boolean>>;

const Cadastro: React.FC = () => {
  const [nome, setNome] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [cpf, setCPF] = React.useState<string>("");
  const [telefone, setTelefone] = React.useState<string>("");
  const [senha, setSenha] = React.useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = React.useState<string>("");

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [touched, setTouched] = React.useState<Touched>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [msgSucesso, setMsgSucesso] = React.useState<string>("");
  const [msgErro, setMsgErro] = React.useState<string>("");

  // Validação unitária por campo
  const validateField = (field: keyof FormValues, value: string): string | null => {
    switch (field) {
      case "nome": {
        const r = registerSchema.shape.nome.safeParse(value);
        return r.success ? null : r.error.issues[0]?.message ?? "Valor inválido";
      }
      case "email": {
        const r = registerSchema.shape.email.safeParse(value);
        return r.success ? null : r.error.issues[0]?.message ?? "Valor inválido";
      }
      case "cpf": {
        const r = registerSchema.shape.cpf.safeParse(value);
        return r.success ? null : r.error.issues[0]?.message ?? "Valor inválido";
      }
      case "telefone": {
        const r = registerSchema.shape.telefone.safeParse(value);
        return r.success ? null : r.error.issues[0]?.message ?? "Valor inválido";
      }
      case "senha": {
        const r = senhaSchema.safeParse(value);
        return r.success ? null : r.error.issues[0]?.message ?? "Valor inválido";
      }
      case "confirmarSenha": {
        if (!value?.trim()) return "Confirme a senha";
        if (value !== senha) return "As senhas não coincidem";
        return null;
      }
      default:
        return null;
    }
  };

  // Handlers onChange — com revalidação se já tocou
  const handleNomeChange = (event: InputEvt) => {
    const value = event.target.value;
    setNome(value);
    if (touched.nome)
      setErrors((prev) => ({ ...prev, nome: validateField("nome", value) }));
  };

  const handleEmailChange = (event: InputEvt) => {
    const value = event.target.value;
    setEmail(value);
    if (touched.email)
      setErrors((prev) => ({ ...prev, email: validateField("email", value) }));
  };

  const handleCPFChange = (event: InputEvt) => {
    const raw = onlyDigits(event.target.value).slice(0, 11);
    setCPF(raw);
    if (touched.cpf)
      setErrors((prev) => ({ ...prev, cpf: validateField("cpf", raw) }));
  };

  const handleTelefoneChange = (event: InputEvt) => {
    const raw = onlyDigits(event.target.value).slice(0, 11);
    setTelefone(raw);
    if (touched.telefone)
      setErrors((prev) => ({
        ...prev,
        telefone: validateField("telefone", raw),
      }));
  };

  const handleSenhaChange = (event: InputEvt) => {
    const value = event.target.value;
    setSenha(value);
    if (touched.senha)
      setErrors((prev) => ({ ...prev, senha: validateField("senha", value) }));
    // Se confirmarSenha já foi tocada, revalida também a confirmação
    if (touched.confirmarSenha)
      setErrors((prev) => ({
        ...prev,
        confirmarSenha: validateField("confirmarSenha", confirmarSenha),
      }));
  };

  const handleConfirmarSenhaChange = (event: InputEvt) => {
    const value = event.target.value;
    setConfirmarSenha(value);
    if (touched.confirmarSenha)
      setErrors((prev) => ({
        ...prev,
        confirmarSenha: validateField("confirmarSenha", value),
      }));
  };

  // Handler onBlur genérico
  const handleBlur =
    (field: keyof FormValues) =>
    (_e: BlurEvt): void => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const currentValue =
        field === "nome"
          ? nome
          : field === "email"
          ? email
          : field === "cpf"
          ? cpf
          : field === "telefone"
          ? telefone
          : field === "senha"
          ? senha
          : confirmarSenha;
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, currentValue),
      }));
    };

  // Submit com validação do objeto inteiro + chamada à API
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMsgSucesso("");
    setMsgErro("");

    // marca todos como tocados
    setTouched({
      nome: true,
      email: true,
      cpf: true,
      telefone: true,
      senha: true,
      confirmarSenha: true,
    });

    const values: FormValues = {
      nome,
      email,
      cpf,
      telefone,
      senha,
      confirmarSenha,
    };

    const res = registerSchema.safeParse(values);

    if (!res.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of res.error.issues) {
        const field = issue.path[0] as keyof FormValues;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    // sucesso -> cpf/telefone já "limpos" via transform
    try {
      setIsLoading(true);
      await registerApi({
        nome: res.data.nome,
        email: res.data.email,
        senha: res.data.senha,
        cpf: res.data.cpf, // já digits-only
        telefone: res.data.telefone, // já digits-only
      });
      setMsgSucesso("Cadastro realizado com sucesso! Você já pode fazer login.");
      setMsgErro("");
      // (Opcional) limpar campos
      setNome("");
      setEmail("");
      setCPF("");
      setTelefone("");
      setSenha("");
      setConfirmarSenha("");
      setTouched({});
      setErrors({});
    } catch (error: any) {
      const mensagem =
        error?.response?.data?.message ||
        "Erro ao cadastrar. Tente novamente.";
      setMsgErro(mensagem);
      setMsgSucesso("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={5} sx={{ p: 3, width: 380 }}>
        <Box mb={2} textAlign="center">
          <Typography variant="h6" component="h2" color="textPrimary" fontWeight={600} mb={1}>
            Bem-Vindo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preencha os dados para criar sua conta
          </Typography>
        </Box>

        {msgSucesso && <Alert severity="success">{msgSucesso}</Alert>}
        {msgErro && <Alert severity="error">{msgErro}</Alert>}

        <Box textAlign="initial" component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
          {/* Nome */}
          <TextField
            margin="normal"
            color="primary"
            required
            fullWidth
            id="nome"
            label="Nome"
            name="nome"
            autoComplete="nome"
            autoFocus
            value={nome}
            onChange={handleNomeChange}
            onBlur={handleBlur("nome")}
            error={!!touched.nome && !!errors.nome}
            helperText={touched.nome ? errors.nome ?? " " : " "}
            disabled={isLoading}
          />

          {/* Email */}
          <TextField
            margin="normal"
            color="primary"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleBlur("email")}
            error={!!touched.email && !!errors.email}
            helperText={touched.email ? errors.email ?? " " : " "}
            disabled={isLoading}
          />

          {/* CPF */}
          <TextField
            margin="normal"
            color="primary"
            required
            fullWidth
            id="cpf"
            label="CPF"
            name="cpf"
            autoComplete="cpf"
            value={formatCPF(cpf)} // exibe formatado
            onChange={handleCPFChange} // guarda cru
            onBlur={handleBlur("cpf")}
            slotProps={{ htmlInput: { inputMode: "numeric", pattern: "[0-9]*" } }}
            error={!!touched.cpf && !!errors.cpf}
            helperText={touched.cpf ? errors.cpf ?? " " : " "}
            disabled={isLoading}
          />

          {/* Telefone */}
          <TextField
            margin="normal"
            color="primary"
            required
            fullWidth
            id="telefone"
            label="Telefone"
            name="telefone"
            autoComplete="tel"
            value={formatPhoneBR(telefone)} // exibe formatado
            onChange={handleTelefoneChange} // guarda cru
            onBlur={handleBlur("telefone")}
            slotProps={{ htmlInput: { inputMode: "tel", pattern: "[0-9]*" } }}
            error={!!touched.telefone && !!errors.telefone}
            helperText={touched.telefone ? errors.telefone ?? " " : " "}
            disabled={isLoading}
          />

          {/* Senha */}
          <TextField
            margin="normal"
            color="primary"
            required
            fullWidth
            id="senha"
            label="Senha"
            name="senha"
            type="password"
            value={senha}
            onChange={handleSenhaChange}
            onBlur={handleBlur("senha")}
            error={!!touched.senha && !!errors.senha}
            helperText={touched.senha ? errors.senha ?? " " : " "}
            disabled={isLoading}
          />

          {/* Confirmar Senha */}
          <TextField
            margin="normal"
            color="primary"
            required
            fullWidth
            id="confirmarSenha"
            label="Confirmar senha"
            name="confirmarSenha"
            type="password"
            value={confirmarSenha}
            onChange={handleConfirmarSenhaChange}
            onBlur={handleBlur("confirmarSenha")}
            error={!!touched.confirmarSenha && !!errors.confirmarSenha}
            helperText={touched.confirmarSenha ? errors.confirmarSenha ?? " " : " "}
            disabled={isLoading}
          />

          {/* Botão de cadastrar */}
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              color="primary"
              variant="contained"
              sx={{ mt: 4, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={18} color="inherit" />
                  Salvando...
                </Box>
              ) : (
                "Cadastrar"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Cadastro;
