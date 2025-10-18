// src/App.tsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Cadastro from "./pages/Cadastro";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="*" element={<div>404</div>} /> /
    </Routes>
  );
}
