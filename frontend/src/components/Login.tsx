import { TextField, Box, Paper, Typography, Button, } from "@mui/material"
import { Login as LoginIcon } from "@mui/icons-material"
import  React from "react";
import { z } from "zod";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { Stack } from "@mui/material";


const emailSchema = z.email("Email inválido");
const passwordSchema = z.string().min(4, "A senha deve ter pelo menos 4 caracteres");

type InputEvt = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type BlurEvt  = React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>;


const Login: React.FC = () => {
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");

    const [emailError, setEmailError] = React.useState<string | null>(null);
    const [passwordError, setPasswordError] = React.useState<string | null>(null);

    type Touched = { email: boolean, password: boolean};
    const [touched, setTouched] = React.useState<Touched>({email: false, password: false});


    // Função para lidar com a mudança do valor do campo de email
    const handleEmailChange = (event: InputEvt) => {
        const value = event.target.value;
        setEmail(value)

        if(touched.email){
            setEmailError(validateEmail(value))
        }
    }

    // Função para lidar com a mudança do valor do campo de senha
    const handlePasswordChange = (event: InputEvt) => {
        const value = event.target.value;
        setPassword(value)

        if(touched.password){
            setPasswordError(validatePassword(value))
        }
    }

    // Função para validar o email
    const validateEmail = (email: string): string | null => {
        if(!email.trim()){
            return "Email é obrigatório"
        }
        const resultado = emailSchema.safeParse(email);

        return resultado.success ? null : "Email inválido";
    }

    // Função para validar a senha
    const validatePassword = (password: string): string | null => {
        if(!password.trim()){
            return "Senha é obrigatória"
        }
        const resultado = passwordSchema.safeParse(password);

        return resultado.success ? null : "Senha inválida";
    }

    // Funcoes para efeito blur
    const handleEmailBlur = (event: BlurEvt) => {
        setTouched(prev => ({ ...prev, email: true }));
        setEmailError(validateEmail(event.target.value));
      };
    
      const handlePasswordBlur = (event: BlurEvt) => {
        setTouched(prev => ({ ...prev, password: true }));
        setPasswordError(validatePassword(event.target.value));
      };
    

    // Função para lidar com o envio do formulário no botão submit
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setTouched({ email: true, password: true });

        const emailMsg = validateEmail(email);
        const passwordMsg = validatePassword(password);

        console.log("Email:", email, emailMsg);
        console.log("Password:", password, passwordMsg);
        console.log('Botao submitted');

    };

    const inputsValidos: boolean = !emailError && !passwordError;


    return(
        <Box 
        display = "flex"
        justifyContent = "center"
        alignItems = "center"
        minHeight = "80vh"
        >

            <Paper
            elevation = {5}
            sx = {{p: 3, width: 360}}
            >

                <Box
                mb = {2}
                textAlign = "center"
                >
                    <LoginIcon sx = {{
                        color: "primary.main",
                        mb: 1,
                        fontSize: 36,
                    }}/>
                    <Typography
                    variant = "h6"
                    component = "h2"
                    fontWeight = {600}
                    mb = {1}
                    >
                        Bem-Vindo
                    
                        </Typography>

                        <Stack spacing={0.5} mb={3}>
                           <Typography variant="body1" color="text.secondary">
                                Faça login para continuar ou
                            </Typography>
                            <MuiLink 
                            component={RouterLink} 
                            to="/cadastro" 
                            underline="hover"
                            >
                            crie uma conta
                        </MuiLink>
                    </Stack>
                </Box>

                <Box
                component = {"form"}
                noValidate
                onSubmit = {handleSubmit}
                >
                    <TextField 
                    label = "Email"
                    type = "email"
                    fullWidth
                    margin = "normal"
                    onChange = {handleEmailChange}
                    variant = {"standard"}
                    onBlur = {handleEmailBlur}
                    error = {touched.email && !!emailError}
                    helperText = {touched.email ? (emailError ?? "") : ""}
                    />
                    
                    <TextField 
                    label = "Senha" 
                    type="password" 
                    fullWidth
                    margin = "normal"
                    onChange = {handlePasswordChange}
                    variant = {"standard"}
                    onBlur = {handlePasswordBlur}
                    error = {touched.password && !!passwordError}
                    helperText = {touched.password ? (passwordError ?? "") : ""}
                    />

                    <Button 
                    type = "submit"
                    fullWidth
                    variant = "contained"
                    color = "primary"
                    sx = {{mt: 2}}
                    size = "large"
                    disabled = {!inputsValidos}
                    >
                        Entrar
                        </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default Login;