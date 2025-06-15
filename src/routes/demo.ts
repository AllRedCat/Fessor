import { Elysia, t } from 'elysia'
import db from '../db'
import { eq } from 'drizzle-orm'
import { demo } from '../db/schema'

const errorSchema = t.Object({
    message: t.String(),
})

const successSchema = t.Object({
    id: t.Number(),
    name: t.String(),
    description: t.String(),
})

const router = new Elysia({ prefix: '/demo' })
    .get('/demo', async () => {
        const demos = await db.select().from(demo)
        return demos
    }, {
        detail: {
            tags: ['Demo'],
        },
        response: {
            200: t.Array(successSchema),
            404: errorSchema,
        },
    })
    .get('/demo/:id', async ({ params: { id } }) => {
        const demoItem = await db.select().from(demo).where(eq(demo.id, parseInt(id)))
        if (demoItem.length === 0) {
            return { message: 'Demo not found' }
        }
        return demoItem[0]
    }, {
        detail: {
            tags: ['Demo'],
        },
        response: {
            200: successSchema,
            404: errorSchema,
        },
    })
    .post('/demo', async ({ body }) => {
        const { name, description } = body as { name: string; description: string }
        if (!name || !description) {
            return {
                status: 400,
                body: { message: 'Name and description are required' },
            }
        }
        const [newDemo] = await db.insert(demo).values({ name, description }).returning()
        return newDemo
    }, {
        detail: {
            tags: ['Demo'],
        },
        response: {
            200: successSchema,
            404: errorSchema,
        },
    })
    .put('/demo/:id', async ({ params: { id }, body }) => {
        const { name, description } = body as { name: string; description: string }
        if (!name || !description) {
            return {
                status: 400,
                body: { message: 'Name and description are required' },
            }
        }
        const [updatedDemo] = await db.update(demo).set({ name, description }).where(eq(demo.id, parseInt(id))).returning()
        if (!updatedDemo) {
            return {
                status: 404,
                body: { message: 'Demo not found' },
            }
        }
        return updatedDemo
    }, {
        detail: {
            tags: ['Demo'],
        },
        response: {
            200: successSchema,
            400: errorSchema,
            404: errorSchema,
        },
    })
    .delete('/demo/:id', async ({ params: { id } }) => {
        const deletedDemo = await db.delete(demo).where(eq(demo.id, parseInt(id))).returning()
        if (deletedDemo.length === 0) {
            return { message: 'Demo not found' }
        }
        return { message: 'Demo deleted successfully' }
    }, {
        detail: {
            tags: ['Demo'],
        },
        response: {
            200: t.Object({ message: t.String() }),
            404: errorSchema,
        },
    })

export default router;