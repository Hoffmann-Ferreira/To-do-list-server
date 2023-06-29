import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt, { FastifyJWTOptions } from '@fastify/jwt';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth';
import { tasksRoutes } from './routes/tasks';
import { userRoutes } from './routes/user';

dotenv.config();

const server = fastify();
const secretKey = process.env.SECRET_KEY;

server.register(fastifyJwt, {
  secret: secretKey,
} as FastifyJWTOptions);

server.register(cors, {
  origin: true,
});

server.register(authRoutes);
server.register(userRoutes);
server.register(tasksRoutes);

server.listen({ port: 3333 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`😁 HTTP server running on http://localhost:3333`);
});
