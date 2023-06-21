import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export async function userRoutes(server: FastifyInstance) {
  server.post('/register', async (request) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      senha: z.string(),
    });

    const { name, email, senha } = bodySchema.parse(request.body);
    console.log('cheguei', name, email, senha);

    const createUser = await prisma.user.create({
      data: {
        name,
        email,
        senha,
      },
    });

    const token = server.jwt.sign(
      { name: createUser.name },
      {
        expiresIn: '30 days',
      }
    );
    console.log(token);

    return createUser;
  });

  server.get('/user/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: id,
      },
      include: {
        tasks: true,
      },
    });

    return user;
  });
}
