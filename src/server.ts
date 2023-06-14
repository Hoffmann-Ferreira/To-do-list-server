import fastify from 'fastify';
import { request } from 'http';

const server = fastify();

server.get('/', async (request, reply) => {
  return 'Is alive 🧟‍♂️ ';
});


server.listen({ port: 3333 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`😁 HTTP server running on http://localhost:3333`);
});
