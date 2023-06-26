import { FastifyError, FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

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

    const verifyUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (verifyUser) {
      const passwordMatches = bcrypt.compareSync(senha, verifyUser.senha);

      if (passwordMatches) {
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
      } else {
        throw reply.code(203).send('Senha incorreta!');
      }
    } else {
      throw reply.code(404).send('Usuário não cadastrado!');
    }
  });

  app.post('/register', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email({ message: 'email inválido' }),
      senha: z
        .string()
        .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
        .regex(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
          message:
            'A senha deve incluir pelo menos uma letra maiúscula um dígito e caracter especial',
        }),
    });

    const { name, email, senha } = bodySchema.parse(request.body);

    const verifyEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (verifyEmail) {
      throw reply.status(400).send('email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const createUser = await prisma.user.create({
      data: {
        name,
        email,
        senha: hashedPassword,
      },
    });

    return createUser;
  });
}
