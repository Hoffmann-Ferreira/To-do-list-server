import { FastifyInstance } from 'fastify';

export async function tasksRoutes(server: FastifyInstance) {
  server.get('/tasks', async (request, reply) => {
    return 'Hello world';
  });
}
