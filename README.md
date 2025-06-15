# Fessor API

API RESTful desenvolvida com Node.js, TypeScript e Elysia.

## Tecnologias Utilizadas

- **Bun** - Runtime JavaScript rápido (recomendado)
- **Node.js** - Runtime JavaScript (alternativo)
- **TypeScript** - Linguagem de programação
- **Elysia** - Framework web para Bun/Node.js
- **tsx** - Executor TypeScript para desenvolvimento

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd fessor
```

2. Instale as dependências:
```bash
npm install
```

## Scripts Disponíveis

- `npm run dev` - Executa o servidor em modo de desenvolvimento
- `npm run build` - Compila o projeto TypeScript
- `npm start` - Executa o servidor em produção
- `npm test` - Executa os testes

## Uso

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

O servidor será iniciado na porta 3000.

## Endpoints

### GET `/`
Retorna uma mensagem de boas-vindas.

### GET `/api/health`
Verifica o status da API.

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "fessor-api"
}
```

### GET `/api/users`
Retorna lista de usuários.

**Resposta:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com"
    },
    {
      "id": 2,
      "name": "Maria Santos",
      "email": "maria@example.com"
    }
  ]
}
```

### GET `/api/users/:id`
Retorna um usuário específico.

**Resposta:**
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

### POST `/api/users`
Cria um novo usuário.

**Body:**
```json
{
  "name": "Novo Usuário",
  "email": "novo@example.com"
}
```

**Resposta:**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "name": "Novo Usuário",
    "email": "novo@example.com"
  }
}
```

## Estrutura do Projeto

```
fessor/
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Licença

ISC

# Fessor
