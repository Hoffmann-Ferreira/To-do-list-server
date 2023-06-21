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
    console.log("cheguei", name, email, senha)

    const createUser = await prisma.user.create({
      data: {
        name,
        email,
        senha,
        googleId: "1",
        avatarUrl: "le"
      },
    });

    const token = server.jwt.sign ({ name: createUser.name });
    console.log(token);

    return createUser;
  });
}
