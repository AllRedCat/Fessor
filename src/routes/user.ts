import { Elysia, t } from 'elysia';
import db from '../db';
import { users } from '../db/schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

const user = new Elysia({ prefix: '/user' })
  // Cadastro de usuário
  .post('/register', async ({ body, set }) => {
    const { name, email, password, document, schoolId } = body as any;
    if (!name || !email || !password || !document || !schoolId) {
      set.status = 400;
      return { error: 'Dados obrigatórios faltando.' };
    }
    // Verifica se email já existe
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      set.status = 409;
      return { error: 'Email já cadastrado.' };
    }
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    // Cria usuário
    const [id] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      document,
      schoolId: Number(schoolId),
    }).$returningId();
    set.status = 201;
    return { id, name, email };
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String(),
      document: t.String(),
      schoolId: t.Number(),
    }),
    detail: {
      description: 'Cadastra um novo usuário.',
      tags: ['User']
    }
  })
  // Login de usuário
  .post('/login', async ({ body, set, cookie }) => {
    const { email, password } = body as any;
    if (!email || !password) {
      set.status = 400;
      return { error: 'Email e senha são obrigatórios.' };
    }
    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length === 0) {
      set.status = 401;
      return { error: 'Usuário ou senha inválidos.' };
    }
    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid) {
      set.status = 401;
      return { error: 'Usuário ou senha inválidos.' };
    }
    // Gera um token de sessão simples
    const sessionToken = Buffer.from(`${user[0].id}:${Date.now()}`).toString('base64');
    cookie.session.value = sessionToken;
    cookie.session.httpOnly = true;
    cookie.session.path = '/';
    cookie.session.maxAge = 60 * 60 * 24;
    return { message: 'Login realizado com sucesso.' };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
    detail: {
      description: 'Realiza o login do usuário e define o cookie de sessão.',
      tags: ['User']
    }
  })
  // Rota para checar se está logado
  .get('/me', ({ cookie }) => {
    if (!cookie.session.value) {
      return { loggedIn: false };
    }
    const [userId] = Buffer.from(cookie.session.value, 'base64').toString().split(':');
    return { loggedIn: true, userId };
  }, {
    detail: {
      description: 'Verifica se o usuário está logado e retorna o userId extraído do cookie de sessão.',
      tags: ['User']
    }
  });

export default user;