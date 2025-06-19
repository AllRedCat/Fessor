import { Elysia, t } from 'elysia';
import db from '../db';
import { students, users } from '../db/schema';
import { eq } from 'drizzle-orm';

async function isAdmin(cookie: any) {
  if (!cookie.session?.value) return false;
  const [userId] = Buffer.from(cookie.session.value, 'base64').toString().split(':');
  if (!userId) return false;
  const user = await db.select().from(users).where(eq(users.id, Number(userId)));
  return user.length > 0 && user[0].role === 'admin';
}

const student = new Elysia({ prefix: '/student' })
  // Criar estudante
  .post('/', async ({ body, set, cookie }) => {
    if (!(await isAdmin(cookie))) {
      set.status = 403;
      return { error: 'Acesso negado: apenas administradores podem cadastrar estudantes.' };
    }
    const { name, document, email, schoolId } = body as any;
    if (!name || !email || !schoolId) {
      set.status = 400;
      return { error: 'Campos obrigatórios faltando.' };
    }
    const existing = await db.select().from(students).where(eq(students.email, email));
    if (existing.length > 0) {
      set.status = 409;
      return { error: 'Email já cadastrado.' };
    }
    const [id] = await db.insert(students).values({
      name,
      document,
      email,
      schoolId: Number(schoolId),
    }).$returningId();
    set.status = 201;
    return { id, name, document, email, schoolId };
  }, {
    body: t.Object({
      name: t.String(),
      document: t.Optional(t.String()),
      email: t.String(),
      schoolId: t.Number(),
    }),
    detail: {
      description: 'Cadastra um novo estudante. Apenas administradores podem acessar.',
      tags: ['Student']
    }
  })
  // Listar todos
  .get('/', async () => {
    return await db.select().from(students);
  }, {
    detail: {
      description: 'Lista todos os estudantes.',
      tags: ['Student']
    }
  })
  // Buscar por ID
  .get('/:id', async ({ params, set }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
      set.status = 400;
      return { error: 'ID inválido' };
    }
    const data = await db.select().from(students).where(eq(students.id, id));
    if (data.length === 0) {
      set.status = 404;
      return { error: 'Estudante não encontrado' };
    }
    return data[0];
  }, {
    params: t.Object({ id: t.String() }),
    detail: {
      description: 'Busca um estudante pelo ID.',
      tags: ['Student']
    }
  })
  // Editar estudante
  .put('/:id', async ({ params, body, set, cookie }) => {
    if (!(await isAdmin(cookie))) {
      set.status = 403;
      return { error: 'Acesso negado: apenas administradores podem editar estudantes.' };
    }
    const id = Number(params.id);
    if (isNaN(id)) {
      set.status = 400;
      return { error: 'ID inválido' };
    }
    const { name, document, email, schoolId } = body as any;
    if (!name || !email || !schoolId) {
      set.status = 400;
      return { error: 'Campos obrigatórios faltando.' };
    }
    const existing = await db.select().from(students).where(eq(students.id, id));
    if (existing.length === 0) {
      set.status = 404;
      return { error: 'Estudante não encontrado.' };
    }
    await db.update(students).set({ name, document, email, schoolId: Number(schoolId) }).where(eq(students.id, id));
    return { id, name, document, email, schoolId };
  }, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      name: t.String(),
      document: t.Optional(t.String()),
      email: t.String(),
      schoolId: t.Number(),
    }),
    detail: {
      description: 'Edita um estudante pelo ID. Apenas administradores podem acessar.',
      tags: ['Student']
    }
  })
  // Remover estudante
  .delete('/:id', async ({ params, set, cookie }) => {
    if (!(await isAdmin(cookie))) {
      set.status = 403;
      return { error: 'Acesso negado: apenas administradores podem remover estudantes.' };
    }
    const id = Number(params.id);
    if (isNaN(id)) {
      set.status = 400;
      return { error: 'ID inválido' };
    }
    const existing = await db.select().from(students).where(eq(students.id, id));
    if (existing.length === 0) {
      set.status = 404;
      return { error: 'Estudante não encontrado.' };
    }
    await db.delete(students).where(eq(students.id, id));
    set.status = 204;
    return { message: 'Estudante removido com sucesso.' };
  }, {
    params: t.Object({ id: t.String() }),
    detail: {
      description: 'Remove um estudante pelo ID. Apenas administradores podem acessar.',
      tags: ['Student']
    }
  });

export default student; 