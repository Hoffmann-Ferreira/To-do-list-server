import fastify from 'fastify';
import { tasksRoutes } from './routes/tasks';
import { userRoutes } from './routes/user';
import jwt from '@fastify/jwt';

const server = fastify();

server.register(jwt, {
  secret: 'To-to-list',
});

server.register(tasksRoutes);
server.register(userRoutes);

server.listen({ port: 3333 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`😁 HTTP server running on http://localhost:3333`);
});
