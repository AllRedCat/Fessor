import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import * as routes from './routes'

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'Fessor API',
        version: '1.0.0',
        description: 'API RESTful desenvolvida com Elysia, TypeScript e Bun/Node.js'
      }
    }
  }))
  .use(routes.demo)
  .use(routes.user)
  .use(routes.school)
  .use(routes.student)
  .use(routes.report)
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)