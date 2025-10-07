import { TextField, Box, Paper, Typography, Button, } from "@mui/material"
import { Login as LoginIcon } from "@mui/icons-material"
import type React from "react";

const Login: React.FC = () => {
    return(
        <Box>
            <Paper>
                <Box>
                    <LoginIcon/>
                    <Typography>Bem-Vindo</Typography>
                    <Typography>Faça login para continuar</Typography>
                </Box>
                <Box>
                    <TextField label = "email "></TextField>
                    <TextField label = "senha "></TextField>
                    <Button>Entrar</Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default Login;