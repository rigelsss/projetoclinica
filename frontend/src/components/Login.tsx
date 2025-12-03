import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { z } from "zod";
import { login as loginApi } from "../services/authService";

const emailSchema = z.email("Email inválido");
const passwordSchema = z.string().min(4, "A senha deve ter pelo menos 4 caracteres");

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");
  const [msgErro, setMsgErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) return { isValid: false, message: "Email é obrigatório" };
    const r = emailSchema.safeParse(value);
    return { isValid: r.success, message: r.success ? "" : "Email inválido" };
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) return { isValid: false, message: "Senha é obrigatória" };
    const r = passwordSchema.safeParse(value);
    return { isValid: r.success, message: r.success ? "" : "Senha com menos de 4 caracteres" };
  };

  const inputsValidos = validateEmail(email).isValid && validatePassword(password).isValid;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const usuario = await loginApi(email, password);
      setMsgSucesso(`Bem-vindo(a), ${usuario.nome}!`);
      setMsgErro("");
      setTimeout(() => navigate("/home"), 1000);
    } catch (error: any) {
      const mensagem = error?.response?.data?.message ?? "Erro ao realizar login. Verifique suas credenciais.";
      setMsgErro(mensagem);
      setMsgSucesso("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={2} sx={{ p: 3, width: 360 }}>
        <Box textAlign="center" mb={2}>
          <LoginIcon sx={{ fontSize: 36, color: "primary.main", mb: 1 }} />
          <Typography variant="h6" component="h2" fontWeight={600} mb={1}>
            Bem-vindo
          </Typography>
          <Stack spacing={0.5} mb={2}>
            <Typography variant="body2" color="text.secondary">
              Faça login para continuar ou
            </Typography>
            <MuiLink component={RouterLink} to="/cadastro" underline="hover">
              crie uma conta
            </MuiLink>
          </Stack>
        </Box>

        {msgSucesso && <Alert>{msgSucesso}</Alert>}
        {msgErro && <Alert severity="error">{msgErro}</Alert>}

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!validateEmail(email).isValid}
            helperText={validateEmail(email).message}
            disabled={isLoading}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!validatePassword(password).isValid}
            helperText={validatePassword(password).message}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!inputsValidos || isLoading}
          >
            {isLoading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} color="inherit" />
                Carregando...
              </Box>
            ) : (
              "Entrar"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
