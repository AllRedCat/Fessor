import { Elysia, t } from 'elysia';
import db from '../db';
import { eq } from 'drizzle-orm';
import { demo } from '../db/schema';

const errorSchema = t.Object({
  message: t.String(),
});

const successSchema = t.Object({
  id: t.Number(),
  name: t.String(),
  description: t.String(),
});

const router = new Elysia({ prefix: '/demo' })
  // GET all
  .get('', async ({}) => {
    const data = await db.select().from(demo);

    if (!data) {
      return {
        status: 500,
        message: 'No data found'
      };
    }

    const result = data.map(item => ({...item}));

    return result;
  }, {
    detail: {
      description: 'Demo para ter de base',
      tags: ['Demo']
    },
    response: {
      200: t.Array(successSchema),
      500: errorSchema
    }
  })

  // GET by ID 
  .get('/:id', async ({ params }) => {
    const { id } = params;
    const numericId = Number(id);
    
    if (isNaN(numericId)) {
      return {
        status: 400,
        message: 'Invalid ID format'
      };
    }
    const data = await db.select().from(demo).where(eq(demo.id, numericId));

    if (data.length === 0) {
      return {
        status: 404,
        message: 'Data not found'
      };
    }

    const result = data[0];

    return result;
  }, {
    detail: {
      description: 'Get a specific demo by ID',
      tags: ['Demo']
    },
    params: t.Object({
      id: t.String({ description: 'ID of the demo' })
    }),
    response: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema
    }
  })

  // POST
  .post('', async ({ body }) => {
    const { name, description } = body;

    if (!name || !description) {
      return {
        status: 400,
        message: 'Name and description are required'
      };
    }

    const conflict = await db.select().from(demo).where(eq(demo.name, name));

    if (conflict.length > 0) {
      return {
        status: 400,
        message: 'Demo with this name already exists'
      };
    };

    const newDemo = {
      name,
      description
    };

    const [insertedDemo] = await db.insert(demo).values(newDemo).$returningId();
    if (!insertedDemo) {
      return {
        status: 500,
        message: 'Failed to create demo'
      };
    };

    return {
      status: 201,
      ...insertedDemo
    };
  }, {
    detail: {
      description: 'Create a new demo entry',
      tags: ['Demo']
    },
    body: t.Object({
      name: t.String({ description: 'Name of the demo' }),
      description: t.String({ description: 'Description of the demo' })
    }),
    response: {
      201: successSchema,
      400: errorSchema
    }
  })

  // PUT
  .put('/:id', async ({ params, body }: { params: { id: string }, body: { name: string, description: string } }) => {
    const { id } = params;
    const numericId = Number(id);

    const { name, description } = body;

    if (!name || !description) {
      return {
        status: 400,
        message: 'Name and description are required'
      };
    }

    const existingDemo = await db.select().from(demo).where(eq(demo.id, numericId));

    if (existingDemo.length === 0) {
      return {
        status: 404,
        message: 'Data not found'
      };
    }

    const updatedDemo = {
      name,
      description
    };

    await db.update(demo).set(updatedDemo).where(eq(demo.id, numericId));

    const response = {
      id: numericId,
      name,
      description
    }

    return response;
  }, {
    detail: {
      description: 'Update an existing demo entry by ID',
      tags: ['Demo']
    },
    params: t.Object({
      id: t.String({ description: 'ID of the demo to update' })
    }),
    body: t.Object({
      name: t.String({ description: 'Updated name of the demo' }),
      description: t.String({ description: 'Updated description of the demo' })
    }),
    response: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema
    }
  })

  // DELETE
  .delete('/:id', async ({ params }) => {
    const { id } = params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return {
        status: 400,
        message: 'Invalid ID format'
      };
    }

    const existingDemo = await db.select().from(demo).where(eq(demo.id, numericId));

    if (existingDemo.length === 0) {
      return {
        status: 404,
        message: 'Data not found'
      };
    }

    await db.delete(demo).where(eq(demo.id, numericId));

    return {
      status: 204,
      message: 'Demo deleted successfully'
    };
  }, {
    detail: {
      description: 'Delete a demo entry by ID',
      tags: ['Demo']
    },
    params: t.Object({
      id: t.String({ description: 'ID of the demo to delete' })
    }),
    response: {
      204: t.Null(),
      400: errorSchema,
      404: errorSchema
    }
  })

export default router;