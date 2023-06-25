import { FastifyError, FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function authRoutes(app: FastifyInstance) {
  app.setErrorHandler(function (error: FastifyError, request, reply) {
    console.error('Ocorreu um erro:', error.message);
    const menssageError = error.message;

    reply.status(400).send({ menssageError });
  });

  app.post('/login', async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email({ message: 'Usuário não cadastrado' }),
      senha: z
        .string()
        .min(8, { message: 'Senha incorreta!' })
        .regex(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
          message: 'Senha incorreta!',
        }),
    });

    const { email, senha } = bodySchema.parse(request.body);

    const verifyUser = await prisma.user.findUniqueOrThrow({
      where: {
        email: email,
      },
    });

    if (verifyUser.senha === senha) {
      const token = app.jwt.sign(
        {
          email: verifyUser.email,
        },
        {
          expiresIn: '30 days',
        }
      );

      reply.code(200).send({ token: token });

      console.log('token', token);
    }
  });
}
