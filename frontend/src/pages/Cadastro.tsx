import { TextField, Box, Paper, Typography, Button, } from "@mui/material"
import  React from "react";
import { z } from "zod";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { Stack } from "@mui/material";

const nomeSchema = z
  .string()
  // Remove espaços antes e depois do nome
  .trim()
  // Deve ter pelo menos 3 caracteres
  .min(3, "Nome muito curto")
  // Garante que virá nome e sobrenome
  .refine(
    (v) => v.split(/\s+/).length >= 2,
    { message: "Informe nome e sobrenome" }
  )
  // Garante que cada parte do nome tem pelo menos 2 letras
  .refine(
    (v) => v.split(/\s+/).every(p => p.length >= 2),
    { message: "Cada parte deve ter pelo menos 2 letras" }
  );

type InputEvt = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type BlurEvt  = React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>;

function handleSubtmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Form submitted")
}

const Cadastro: React.FC = () => {
    const [nome, setNome] = React.useState<string>("")
    const [email, setEmail] = React.useState<string>("")
    const [cpf, setCPF] = React.useState<string>("")
    const [telefone, setTelefone] = React.useState<string>("")
    
    {/* Função para lidar com mudanças no TextField de nome*/}
    const handleNomeChange = (event: InputEvt) => {
        const value = event.target.value;
        setNome(value);
    }

    {/* Função para lidar com mudanças no TextField de email*/}
    const handleEmailChange = (event: InputEvt) => {
        const value = event.target.value;
        setEmail(value);
    }

    {/* Função para lidar com mudanças no TextField de CPF*/}
    const handleCPFChange = (event: InputEvt) => {
        const value = event.target.value;
        setCPF(value);
    }

    {/* Função para lidar com mudanças no TextField de telefone*/}
    const handleTelefoneChange = (event: InputEvt) => {
        const value = event.target.value;
        setTelefone(value);
    }
    
    return(
        <Box
        display = "flex"
        justifyContent = "center"
        alignItems = "center"
        minHeight = "80vh"
        >
            <Paper
            elevation = {5}
            sx = {{p: 3, width: 380}}
            >
                <Box
                mb = {2}
                textAlign = "center"
                >
                    <Typography
                    variant = "h6"
                    component = "h2"
                    color = "textPrimary"
                    fontWeight = {600}
                    mb = {1}
                    >
                        Bem-Vindo
                        
                        </Typography>
                </Box>
                {/*Box do formulario*/}
                <Box
                    textAlign = { "initial"}
                    component = { "form"}
                    noValidate
                    onSubmit={handleSubtmit}
                    sx={{ mt: 3 }}
                    >
                        {/* TextField de nome */}
                    <TextField
                    margin = "normal"
                    color = "primary"
                    required
                    fullWidth
                    id = "nome"
                    label = "Nome"
                    name = "nome"
                    autoComplete = "nome"
                    autoFocus
                />
                {/* TextField de email */}
                <TextField
                    margin = "normal"
                    color = "primary"
                    required
                    fullWidth
                    id = "email"
                    label = "Email"
                    name = "email"
                    autoComplete = "email"
                    autoFocus
                />
                {/* TextField de CPF */}
                <TextField
                    margin = "normal"
                    color = "primary"
                    required
                    fullWidth
                    id = "cpf"
                    label = "CPF"
                    name = "cpf"
                    autoComplete = "cpf"
                    autoFocus
                />
                {/* TextField de telefone */}
                <TextField
                    margin = "normal"
                    color = "primary"
                    required
                    fullWidth
                    id = "telefone"
                    label = "Telefone"
                    name = "telefone"
                    autoComplete = "telefone"
                    autoFocus
                    type = "number"

                ></TextField>
                </Box>
                {/* Box do botão de cadastrar*/}
                <Box
                display = "flex"
                justifyContent = "flex-end"
                >
                    {/* Botão de cadastrar */}
                    <Button
                    type = "submit"
                    color = "primary"
                    variant = "contained"
                    sx = {{mt: 4, mb: 2}}
                    >
                    Cadastrar
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}

export default Cadastro;
