import { FastifyError, FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { string, z } from 'zod';

export async function tasksRoutes(app: FastifyInstance) {
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

    const createdTask = await prisma.task.create({
      data: {
        name,
        date,
        task,
        userId: '3ee7b3d5-e897-44b6-9231-31924b76a0b2',
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

    const creatSubTask = await prisma.task.create({
      data: {
        name,
        date,
        task,
        userId: '3ee7b3d5-e897-44b6-9231-31924b76a0b2',
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
      name: z.string().optional(),
      date: z.string().optional(),
      task: z.string().optional(),
    });

    const { name, date, task } = bodySchema.parse(request.body);

    // let findTask = await prisma.task.findUniqueOrThrow({
    //   where: { id,
    //   },
    // })

    const editTask = await prisma.task.update({
      where: {
        id,
      },
      data: {
        name,
        date,
        task,
      },
    });

    return editTask;
  });

  app.get('/find-all-tasks/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const tasks = await prisma.task.findMany({
      where: {
        userId: id,
      },
    });

    return tasks;
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
