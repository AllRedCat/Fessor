import { Elysia, t } from 'elysia';
import db from '../db';
import { schools } from '../db/schema';
import { eq } from 'drizzle-orm';

const school = new Elysia({ prefix: '/school' })
  .post('/', async ({ body, set }) => {
    const { name, address, city, state, zipCode, principal, phone, email } = body as any;
    if (!name || !address || !city || !state || !zipCode) {
      set.status = 400;
      return { error: 'Campos obrigatórios faltando.' };
    }
    // Verifica se já existe escola com mesmo nome e endereço
    const existing = await db.select().from(schools).where(eq(schools.name, name));
    if (existing.length > 0) {
      set.status = 409;
      return { error: 'Escola já cadastrada.' };
    }
    const [id] = await db.insert(schools).values({
      name,
      address,
      city,
      state,
      zipCode,
      principal,
      phone,
      email,
    }).$returningId();
    set.status = 201;
    return { id, name, address, city, state, zipCode, principal, phone, email };
  }, {
    body: t.Object({
      name: t.String(),
      address: t.String(),
      city: t.String(),
      state: t.String(),
      zipCode: t.String(),
      principal: t.Optional(t.String()),
      phone: t.Optional(t.String()),
      email: t.Optional(t.String()),
    }),
    detail: {
      description: 'Cadastra uma nova escola.',
      tags: ['School']
    }
  })

  // GET all schools
  .get('/', async () => {
    const data = await db.select().from(schools);
    return data;
  }, {
    detail: {
      description: 'Lista todas as escolas.',
      tags: ['School']
    }
  })

  // GET school by ID
  .get('/:id', async ({ params, set }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
      set.status = 400;
      return { error: 'ID inválido' };
    }
    const data = await db.select().from(schools).where(eq(schools.id, id));
    if (data.length === 0) {
      set.status = 404;
      return { error: 'Escola não encontrada' };
    }
    return data[0];
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      description: 'Busca uma escola pelo ID.',
      tags: ['School']
    }
  })

  // PUT (editar escola)
  .put('/:id', async ({ params, body, set }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
      set.status = 400;
      return { error: 'ID inválido' };
    }
    const { name, address, city, state, zipCode, principal, phone, email } = body as any;
    if (!name || !address || !city || !state || !zipCode) {
      set.status = 400;
      return { error: 'Campos obrigatórios faltando.' };
    }
    const existing = await db.select().from(schools).where(eq(schools.id, id));
    if (existing.length === 0) {
      set.status = 404;
      return { error: 'Escola não encontrada.' };
    }
    await db.update(schools).set({
      name,
      address,
      city,
      state,
      zipCode,
      principal,
      phone,
      email,
    }).where(eq(schools.id, id));
    return { id, name, address, city, state, zipCode, principal, phone, email };
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      name: t.String(),
      address: t.String(),
      city: t.String(),
      state: t.String(),
      zipCode: t.String(),
      principal: t.Optional(t.String()),
      phone: t.Optional(t.String()),
      email: t.Optional(t.String()),
    }),
    detail: {
      description: 'Edita uma escola pelo ID.',
      tags: ['School']
    }
  })

  // DELETE escola
  .delete('/:id', async ({ params, set }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
      set.status = 400;
      return { error: 'ID inválido' };
    }
    const existing = await db.select().from(schools).where(eq(schools.id, id));
    if (existing.length === 0) {
      set.status = 404;
      return { error: 'Escola não encontrada.' };
    }
    await db.delete(schools).where(eq(schools.id, id));
    set.status = 204;
    return { message: 'Escola removida com sucesso.' };
  }, {
    params: t.Object({
      id: t.String()
    }),
    detail: {
      description: 'Remove uma escola pelo ID.',
      tags: ['School']
    }
  });

export default school; 