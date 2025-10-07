# 🏥 Projeto Clínica – API REST com Node.js, TypeScript e Prisma

API desenvolvida em **Node.js + Express + Prisma** para gerenciar **Funcionários**, **Pacientes** e **Médicos** de uma clínica.  
Projeto criado para a disciplina **Tópicos Especiais em Desenvolvimento FullStack** (2025.2).

---

## 🚀 Tecnologias Utilizadas
- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Insomnia** (para testes de rotas)

---

## ⚙️ Estrutura do Projeto

```
src/
 ├── controllers/
 │    └── userController.ts
 ├── services/
 │    └── userService.ts
 ├── routes/
 │    └── userRoutes.ts
 ├── db/
 │    └── prisma.ts
 └── index.ts
```

Cada camada possui responsabilidade clara:
- **Controller** → valida requisições, trata erros e responde.
- **Service** → executa as operações Prisma no banco.
- **Routes** → define os endpoints.
- **Index.ts** → sobe o servidor Express e carrega as rotas.

---

## 🧩 Endpoints Principais

### 🔹 Funcionários
| Método | Rota | Descrição | Corpo (JSON) | Retorno esperado |
|--------|------|------------|---------------|------------------|
| GET | `/funcionarios` | Lista todos os funcionários | — | 200 + `[{}]` |
| GET | `/funcionarios/:id` | Retorna funcionário por ID | — | 200 + objeto / 404 se não encontrado |
| POST | `/funcionarios` | Cadastra novo funcionário | `{ nome, idade, cpf, dob }` | 201 + objeto criado |
| PUT | `/funcionarios/:id` | Atualiza parcialmente | `{ campo: valor }` | 200 + objeto atualizado / 404 se ID inválido |
| DELETE | `/funcionarios/:id` | Remove funcionário | — | 204 sem corpo / 404 se não encontrado |

---

### 🔹 Pacientes
| Método | Rota | Descrição | Corpo (JSON) | Retorno esperado |
|--------|------|------------|---------------|------------------|
| GET | `/pacientes` | Lista todos os pacientes | — | 200 + `[{}]` |
| GET | `/pacientes/:id` | Retorna paciente por ID | — | 200 + objeto / 404 se não encontrado |
| POST | `/pacientes` | Cadastra novo paciente | `{ nome, idade, cpf, dob }` | 201 + objeto criado |
| PUT | `/pacientes/:id` | Atualiza parcialmente | `{ campo: valor }` | 200 + objeto atualizado |
| DELETE | `/pacientes/:id` | Remove paciente | — | 204 sem corpo |

---

### 🔹 Médicos
| Método | Rota | Descrição | Corpo (JSON) | Retorno esperado |
|--------|------|------------|---------------|------------------|
| GET | `/medicos` | Lista todos os médicos | — | 200 + `[{}]` |
| GET | `/medicos/:id` | Retorna médico por ID | — | 200 + objeto / 404 se não encontrado |
| POST | `/medicos` | Cadastra novo médico | `{ nome, idade, crm, cpf, dob }` | 201 + objeto criado |
| PUT | `/medicos/:id` | Atualiza parcialmente | `{ campo: valor }` | 200 + objeto atualizado |
| DELETE | `/medicos/:id` | Remove médico | — | 204 sem corpo |

---

## 🧪 Testes com Insomnia

### 📦 Importação
O arquivo de testes pode ser importado diretamente no Insomnia:
```
File → Import → From File
```

Arquivo: `clinica_insomnia_cloud.json`

O ambiente padrão já está configurado com o domínio:
```
https://3000-firebase-projetoclinica-1758324245242.cluster-f73ibkkuije66wssuontdtbx6q.cloudworkstations.dev
```

### 📂 Grupos de Requisições
- **Funcionarios**
- **Pacientes**
- **Medicos**
- **❌ Erros esperados**

---

## ⚠️ Casos de Erro Esperados

| Cenário | Exemplo | Código | Mensagem esperada |
|----------|----------|--------|------------------|
| CPF inválido | `11111111111` | 400 | `"CPF com formato inválido. Use o formato XXX.XXX.XXX-XX"` |
| Data inválida | `dob: "01-01-1999"` | 400 | `"Use o formato YYYY-MM-DD"` |
| ID inexistente | `/pacientes/99999` | 404 | `"Paciente não encontrado para o ID fornecido"` |
| Body vazio no PUT | `{}` | 400 | `"Body vazio. Informe ao menos um campo para atualizar"` |
| Campo tipo errado | `idade: "trinta"` | 400 | `"A idade deve ser um número inteiro positivo"` |

---

## 🛠️ Execução Local

### 1️⃣ Instalar dependências
```bash
npm install
```

### 2️⃣ Rodar migrações do Prisma (ajuste seu `.env`)
```bash
npx prisma migrate dev
```

### 3️⃣ Iniciar servidor
```bash
npm run dev
```
Servidor padrão:
```
http://localhost:3000
```

---

## ✅ Status Codes Utilizados

| Código | Significado |
|--------|--------------|
| 200 | Sucesso na requisição (GET, PUT) |
| 201 | Recurso criado com sucesso (POST) |
| 204 | Sucesso sem corpo de resposta (DELETE) |
| 400 | Erro de validação de entrada |
| 404 | Recurso não encontrado |
| 500 | Erro interno no servidor |

---

## ✨ Autor
**Rigel Sales**  
Disciplina: *Tópicos Especiais em TI: Desenvolvimento FullStack* – Ciência da Computação - Unipê 
Professor: Douglas Andrade de Meneses  
Período: *2025.2*

---
