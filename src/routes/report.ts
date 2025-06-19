import { Elysia, t } from 'elysia';
import db from '../db';
import { reports } from '../db/schema';
import { eq } from 'drizzle-orm';

const report = new Elysia({ prefix: '/report' })
  // Criar relatório
  .post('/', async ({ body, set }) => {
    const { studentId, userId, schoolId, content } = body as any;
    if (!studentId || !userId || !schoolId || !content) {
      set.status = 400;
      return { error: 'Campos obrigatórios faltando.' };
    }
    const [id] = await db.insert(reports).values({
      studentId: Number(studentId),
      userId: Number(userId),
      schoolId: Number(schoolId),
      content,
    }).$returningId();
    set.status = 201;
    return { id, studentId, userId, schoolId, content };
  }, {
    body: t.Object({
      studentId: t.Number(),
      userId: t.Number(),
      schoolId: t.Number(),
      content: t.String(),
    }),
    detail: {
      description: 'Cadastra um novo relatório.',
      tags: ['Report']
    }
  })
  // Listar todos
  .get('/', async () => {
    return await db.select().from(reports);
  }, {
    detail: {
      description: 'Lista todos os relatórios.',
      tags: ['Report']
    }
  })
  // Buscar por ID
  .get('/:id', async ({ params, set }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
      set.status = 400;
      return { error: 'ID inválido' };
    }
    const data = await db.select().from(reports).where(eq(reports.id, id));
    if (data.length === 0) {
      set.status = 404;
      return { error: 'Relatório não encontrado' };
    }
    return data[0];
  }, {
    params: t.Object({ id: t.String() }),
    detail: {
      description: 'Busca um relatório pelo ID.',
      tags: ['Report']
    }
  })
  // Editar relatório
  .put('/:id', async ({ params, body, set }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
      set.status = 400;
      return { error: 'ID inválido' };
    }
    const { studentId, userId, schoolId, content } = body as any;
    if (!studentId || !userId || !schoolId || !content) {
      set.status = 400;
      return { error: 'Campos obrigatórios faltando.' };
    }
    const existing = await db.select().from(reports).where(eq(reports.id, id));
    if (existing.length === 0) {
      set.status = 404;
      return { error: 'Relatório não encontrado.' };
    }
    await db.update(reports).set({ studentId: Number(studentId), userId: Number(userId), schoolId: Number(schoolId), content }).where(eq(reports.id, id));
    return { id, studentId, userId, schoolId, content };
  }, {
    params: t.Object({ id: t.String() }),
    body: t.Object({
      studentId: t.Number(),
      userId: t.Number(),
      schoolId: t.Number(),
      content: t.String(),
    }),
    detail: {
      description: 'Edita um relatório pelo ID.',
      tags: ['Report']
    }
  })
  // Remover relatório
  .delete('/:id', async ({ params, set }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
      set.status = 400;
      return { error: 'ID inválido' };
    }
    const existing = await db.select().from(reports).where(eq(reports.id, id));
    if (existing.length === 0) {
      set.status = 404;
      return { error: 'Relatório não encontrado.' };
    }
    await db.delete(reports).where(eq(reports.id, id));
    set.status = 204;
    return { message: 'Relatório removido com sucesso.' };
  }, {
    params: t.Object({ id: t.String() }),
    detail: {
      description: 'Remove um relatório pelo ID.',
      tags: ['Report']
    }
  });

export default report; 