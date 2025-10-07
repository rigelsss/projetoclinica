import express from "express";
import { Express } from "express";
import userRoutes from "./routes/userRoutes";

const app: Express = express();
const port: number = 3000;

app.use(express.json());
app.use(userRoutes);

app.listen(port, () => {
  console.log(`A API subiu na porta ${port}`);
});
