import { TextField, Box, Paper, Typography, Button, } from "@mui/material"
import { Login as LoginIcon } from "@mui/icons-material"
import type React from "react";
import { useState } from "react";
import { z } from "zod";

const emailSchema = z.email();
const passwordSchema = z.string().min(4);

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    const validateEmail = (email: string) => {
        if(!email.trim()) { //early return
            return { isValid: false, message: "Email é obrigatório"}
        }
        const resultado = emailSchema.safeParse(email);
        return {
            isValid: resultado.success,
            message: resultado.success ? "" : "Email invalido",
        }
    }

    const validatePassword = (password: string) => {
        if(!password.trim()) { //early return
            return { isValid: false, message: "Password é obrigatório"}
        }
        const resultado = passwordSchema.safeParse(password);
        return {
            isValid: resultado.success,
            message: resultado.success ? "" : "Senha invalido",
        }
    }


    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const emailValido = validateEmail(email).isValid;
        const passwordValido = validatePassword(password).isValid;
        console.log("Email:", email, emailValido)
        console.log("Senha:", password, passwordValido)
    } 

    return(
        <Box 
        display = "flex" 
        justifyContent = "center" 
        alignItems = "center" 
        minHeight = "80vh"
        >
            <Paper
            elevation = {2}
            sx = {{p: 3, width: 320 }}
            >
                <Box
                textAlign = "center"
                mb = {2}
                >
                    <LoginIcon 
                    sx = {{ fontSize: 36, color: "primary.main", mb: 1}}/>
                    <Typography 
                    variant = "h6" 
                    component = "h2"
                    fontWeight= {600}
                    mb = {1}
                    >
                        Bem-Vindo</Typography>

                    <Typography
                    variant = "body2"
                    color = "text.secondary"
                    >
                        Faça login para acessar o sistema</Typography>
                    <Box>
                        <Typography>ou</Typography>
                        <Button>Criar uma conta</Button>
                    </Box>
                </Box>

                <Box
                component = "form"
                onSubmit = {handleSubmit}
                noValidate
                >
                    <TextField 
                    label = "Email " 
                    type = "email" 
                    value = {email}
                    fullWidth 
                    margin = "normal" 
                    onChange = {handleEmailChange}
                    />

                    <TextField 
                    label = "Senha " 
                    type = "password"
                    value = {password}
                    fullWidth
                    margin = "normal" 
                    onChange = {handlePasswordChange}
                    />

                    <Button
                    type = "submit"
                    variant = "contained"
                    color = "primary"
                    fullWidth
                    sx = {{ mt: 2 }}
                    >
                        Entrar</Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default Login;