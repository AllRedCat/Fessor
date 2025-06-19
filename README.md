# Fessor API

API RESTful desenvolvida com Node.js, TypeScript e Elysia.
API para o projeto "Fessor"

## Tecnologias Utilizadas

- **Bun** - Runtime JavaScript rápido (recomendado)
- **Node.js** - Runtime JavaScript (alternativo)
- **TypeScript** - Linguagem de programação
- **Elysia** - Framework web para Bun/Node.js
- **Drizzle ORM** - ORM para bancos SQL
- **MySQL** - Banco de dados relacional
- **bcrypt** - Criptografia de senhas
- **Swagger** - Documentação automática da API

Obs.: Pode ser usado com `bun` e com `npm`

---

## Como rodar o projeto

```bash
# Com bun (recomendado)
bun install
bun run dev

# Ou com npm
npm install
npm run dev:node
```

A API estará disponível em `http://localhost:3000`.

---

## Documentação Interativa (Swagger)

Acesse a documentação interativa em:  
`http://localhost:3000/swagger`

---

## Autenticação

- O login é feito via `POST /user/login`.
- O backend retorna um cookie de sessão httpOnly chamado `session`.
- Para acessar rotas protegidas (ex: cadastro, edição e remoção de estudantes), envie o cookie de sessão na requisição.
- Apenas usuários com `role: admin` podem criar, editar ou remover estudantes.

---

## Estrutura das Tabelas Principais

### users
- id (int, PK)
- name (string)
- document (string, único)
- email (string, único)
- password (string, hash)
- role (enum: admin, user, demo)
- createdAt, updatedAt (timestamp)
- profilePicture (string, opcional)
- schoolId (int, FK)

### schools
- id (int, PK)
- name, address, city, state, zipCode (string)
- principal, phone, email (string, opcional)
- createdAt, updatedAt (timestamp)

### students
- id (int, PK)
- name (string)
- document (string, único, opcional)
- email (string, único)
- schoolId (int, FK)
- createdAt, updatedAt (timestamp)

### reports
- id (int, PK)
- studentId (int, FK)
- userId (int, FK)
- schoolId (int, FK)
- content (string)
- createdAt, updatedAt (timestamp)

---

## Endpoints Principais

### Usuário
- `POST /user/register` — Cadastro de usuário
- `POST /user/login` — Login (retorna cookie de sessão)
- `GET /user/me` — Verifica se está logado

### Escola
- `POST /school` — Cadastrar escola
- `GET /school` — Listar escolas
- `GET /school/:id` — Buscar escola por ID
- `PUT /school/:id` — Editar escola
- `DELETE /school/:id` — Remover escola

### Estudante
- `POST /student` — Cadastrar estudante (**apenas admin**)
- `GET /student` — Listar estudantes
- `GET /student/:id` — Buscar estudante por ID
- `PUT /student/:id` — Editar estudante (**apenas admin**)
- `DELETE /student/:id` — Remover estudante (**apenas admin**)

### Relatório
- `POST /report` — Cadastrar relatório
- `GET /report` — Listar relatórios
- `GET /report/:id` — Buscar relatório por ID
- `PUT /report/:id` — Editar relatório
- `DELETE /report/:id` — Remover relatório

### Demo
- `GET /demo` — Listar demos
- `GET /demo/:id` — Buscar demo por ID
- `POST /demo` — Criar demo
- `PUT /demo/:id` — Editar demo
- `DELETE /demo/:id` — Remover demo

---

## Exemplo de Cadastro e Login

### Cadastro de usuário
```http
POST /user/register
Content-Type: application/json
{
  "name": "Admin",
  "email": "admin@fessor.com",
  "password": "senha123",
  "document": "123456789",
  "schoolId": 1
}
```

### Login
```http
POST /user/login
Content-Type: application/json
{
  "email": "admin@fessor.com",
  "password": "senha123"
}
```

O cookie de sessão será retornado e deve ser enviado nas próximas requisições protegidas.

---

## Observações
- Para acessar rotas protegidas, envie o cookie de sessão retornado no login.
- Apenas usuários com `role: admin` podem cadastrar, editar ou remover estudantes.
- Utilize o Swagger para explorar e testar todos os endpoints disponíveis.

## Licença

Ainda pendente