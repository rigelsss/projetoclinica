import { TextField, Box, Paper, Typography, Button, } from "@mui/material"
import  React from "react";
import { z } from "zod";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { Stack } from "@mui/material";

type InputEvt = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type BlurEvt  = React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>;
const onlyDigits = (s: string) => s.replace(/[^\d]/g, "");

// Formata CPF para XXX.XXX.XXX-XX 
function formatCPF(digits: string): string {
  const v = onlyDigits(digits).slice(0, 11);
  if (v.length <= 3) return v;
  if (v.length <= 6) return `${v.slice(0,3)}.${v.slice(3)}`;
  if (v.length <= 9) return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
  return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
}

// Formata celular BR (11 dígitos) — (DD) 9 XXXX-XXXX
function formatPhoneBR(digits: string): string {
  const numero = onlyDigits(digits).slice(0, 11);
  if (numero.length === 0) return "";
  if (numero.length <= 2) return `(${numero}`;
  if (numero.length <= 3) return `(${numero.slice(0,2)}) ${numero.slice(2)}`;
  if (numero.length <= 7) return `(${numero.slice(0,2)}) ${numero.slice(2,3)} ${numero.slice(3)}`;
  return `(${numero.slice(0,2)}) ${numero.slice(2,3)} ${numero.slice(3,7)}-${numero.slice(7)}`;
}

// Funcao de validação de CPF (versão simples)
function isValidCPF(digits: string): boolean {
  if (digits.length !== 11) return false;                 // tamanho
  if (/^(\d)\1{10}$/.test(digits)) return false;          // sequências
  return true;                                            // (pode evoluir c/ DV)
}

// Schema de nome
const nomeSchema = z
  .string()
  .trim()
  .min(3, "Nome muito curto")
  .refine((v) => v.split(/\s+/).length >= 2, { message: "Informe nome e sobrenome" })
  .refine((v) => v.split(/\s+/).every(p => p.length >= 2), { message: "Cada parte deve ter pelo menos 2 letras" });

// Schema de CPF
const cpfSchema = z
  .string()
  .trim()
  .transform(onlyDigits)
  .refine((v) => v.length === 11, "CPF deve ter 11 dígitos")
  .refine(isValidCPF, "CPF inválido");

// Schema de email
const emailSchema = z.email("Email inválido");

// Schema de telefone
const telefoneSchema = z
  .string()
  .trim()
  .transform(onlyDigits)
  .refine((v) => v.length === 11, "Telefone (DDD + número) deve ter 11 dígitos")
  .refine((v) => v.slice(0, 2) !== "00", "DDD inválido")
  .refine((v) => v[2] === "9", "Para celular, o número deve iniciar com 9");

// Schema do formulário (4 campos)
const registerSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  cpf: cpfSchema,
  telefone: telefoneSchema,
});

type FormValues = z.infer<typeof registerSchema>;
type FormErrors = Partial<Record<keyof FormValues, string | null>>;
type Touched = Partial<Record<keyof FormValues, boolean>>;

const Cadastro: React.FC = () => {
  const [nome, setNome] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")
  const [cpf, setCPF] = React.useState<string>("")
  const [telefone, setTelefone] = React.useState<string>("")

  // estados de erro e touched
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [touched, setTouched] = React.useState<Touched>({});

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
      default:
        return null;
    }
  };

  // Handlers onChange — com revalidação se já tocou
  const handleNomeChange = (event: InputEvt) => {
    const value = event.target.value;
    setNome(value);
    if (touched.nome) setErrors(prev => ({ ...prev, nome: validateField("nome", value) }));
  };

  const handleEmailChange = (event: InputEvt) => {
    const value = event.target.value;
    setEmail(value);
    if (touched.email) setErrors(prev => ({ ...prev, email: validateField("email", value) }));
  };

  const handleCPFChange = (event: InputEvt) => {
    const raw = onlyDigits(event.target.value).slice(0, 11);
    setCPF(raw);
    if (touched.cpf) setErrors(prev => ({ ...prev, cpf: validateField("cpf", raw) }));
  };

  const handleTelefoneChange = (event: InputEvt) => {
    const raw = onlyDigits(event.target.value).slice(0, 11);
    setTelefone(raw);
    if (touched.telefone) setErrors(prev => ({ ...prev, telefone: validateField("telefone", raw) }));
  };

  // Handler onBlur genérico
  const handleBlur = (field: keyof FormValues) => (_e: BlurEvt) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const currentValue =
      field === "nome" ? nome :
      field === "email" ? email :
      field === "cpf" ? cpf :
      telefone;
    setErrors(prev => ({ ...prev, [field]: validateField(field, currentValue) }));
  };

  // Submit com validação do objeto inteiro
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // marca todos como tocados
    setTouched({ nome: true, email: true, cpf: true, telefone: true });

    const values: FormValues = { nome, email, cpf, telefone };
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

    // sucesso -> valores já "limpos" para cpf/telefone via transform
    console.log("Cadastro válido:", res.data); // aqui você chamaria a API
  };

  return(
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={5} sx={{ p: 3, width: 380 }}>
        <Box mb={2} textAlign="center">
          <Typography variant="h6" component="h2" color="textPrimary" fontWeight={600} mb={1}>
            Bem-Vindo
          </Typography>
        </Box>

        {/* Formulário (agora o botão está DENTRO) */}
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
            helperText={touched.nome ? (errors.nome ?? " ") : " "}
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
            helperText={touched.email ? (errors.email ?? " ") : " "}
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
            value={formatCPF(cpf)}                           // exibe formatado
            onChange={handleCPFChange}                       // guarda cru
            onBlur={handleBlur("cpf")}
            slotProps={{ htmlInput: { inputMode: "numeric", pattern: "[0-9]*" } }}
            error={!!touched.cpf && !!errors.cpf}
            helperText={touched.cpf ? (errors.cpf ?? " ") : " "}
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
            value={formatPhoneBR(telefone)}                  // exibe formatado
            onChange={handleTelefoneChange}                  // guarda cru
            onBlur={handleBlur("telefone")}
            slotProps={{ htmlInput: { inputMode: "tel", pattern: "[0-9]*" } }}
            error={!!touched.telefone && !!errors.telefone}
            helperText={touched.telefone ? (errors.telefone ?? " ") : " "}
          />

          {/* Botão de cadastrar (DENTRO do form) */}
          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" color="primary" variant="contained" sx={{ mt: 4, mb: 2 }}>
              Cadastrar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default Cadastro;
