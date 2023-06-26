import { FastifyInstance, FastifyError } from 'fastify';
import { prisma } from '../lib/prisma';
import { string, z } from 'zod';

export async function userRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Não autorizado' });
    }
  });

  app.setErrorHandler(function (error: FastifyError, request, reply) {
    console.error('Ocorreu um erro:', error.message);
    const menssageError = error.message;

    reply.status(400).send({ menssageError });
  });

  app.get('/user/:id', async (request) => {
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

  app.patch('/edit-user/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      name: z.string().optional(),
      email: z.string().email({ message: 'email inválido' }).optional(),
      senha: z
        .string()
        .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
        .regex(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
          message:
            'A senha deve incluir pelo menos uma letra maiúscula um dígito e caracter especial',
        })
        .optional(),
    });

    const { name, email, senha } = bodySchema.parse(request.body);

    if (email != undefined) {
      const verifyEmail = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      if (verifyEmail?.email === email) {
        throw reply.status(400).send('email já cadastrado');
      }
    }

    const editUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        senha,
      },
    });

    return editUser;
  });

  app.delete('/delete-user/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const deleteUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return deleteUser;
  });
}
