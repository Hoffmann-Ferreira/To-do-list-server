import fastify from 'fastify';
import { tasksRoutes } from './routes/tasks';

const server = fastify();

server.register(tasksRoutes)

server.listen({ port: 3333 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`😁 HTTP server running on http://localhost:3333`);
});
