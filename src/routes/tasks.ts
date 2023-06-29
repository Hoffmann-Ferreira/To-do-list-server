import { FastifyError, FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { string, z } from 'zod';

export async function tasksRoutes(app: FastifyInstance) {
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

  app.post('/creating-task', async (request) => {
    const bodySchema = z.object({
      name: z.string(),
      date: z.string(),
      task: z.string(),
    });

    const { name, date, task } = bodySchema.parse(request.body);

    const userIdSchema = z.object({
      email: z.string().email(),
    });

    const { email } = userIdSchema.parse(request.user);

    const findUserId = await prisma.user.findFirstOrThrow({
      where: {
        email: email,
      },
    });

    const createdTask = await prisma.task.create({
      data: {
        name,
        date,
        task,
        userId: findUserId.id,
      },
    });

    return createdTask;
  });

  app.post('/creat-sub-task/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      name: z.string().optional(),
      date: z.string().optional(),
      task: z.string().optional(),
    });

    const { name, date, task } = bodySchema.parse(request.body);

    const userIdSchema = z.object({
      email: z.string().email(),
    });

    const { email } = userIdSchema.parse(request.user);

    const findUserId = await prisma.user.findFirstOrThrow({
      where: {
        email: email,
      },
    });

    const creatSubTask = await prisma.task.create({
      data: {
        name,
        date,
        task,
        userId: findUserId.id,
        taskId: id,
      },
    });

    return creatSubTask;
  });

  app.patch('/edit-task/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      concluded: z.boolean().optional(),
      name: z.string().optional(),
      date: z.string().optional(),
      task: z.string().optional(),
    });

    const { concluded, name, date, task } = bodySchema.parse(request.body);

    const editTask = await prisma.task.update({
      where: {
        id,
      },
      data: {
        concluded,
        name,
        date,
        task,
      },
    });

    return editTask;
  });

  app.get('/find-all-tasks/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const userIdSchema = z.object({
      email: z.string().email(),
    });

    const { email } = userIdSchema.parse(request.user);

    const verifyUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (verifyUser?.id === id) {
      const tasks = await prisma.task.findMany({
        where: {
          userId: id,
        },
      });

      return tasks;
    } else {
      reply.code(401).send('Não autorizado!');
    }
  });

  app.get('/task/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const tasks = await prisma.task.findFirstOrThrow({
      where: {
        id: id,
      },
      include: { sub: true },
    });

    return tasks;
  });

  app.delete('/delete-task/:id', async (request) => {
    const paramsSchema = z.object({
      id: string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const deleteTask = await prisma.task.delete({
      where: {
        id: id,
      },
    });

    return deleteTask;
  });
}
