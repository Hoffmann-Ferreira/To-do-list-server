import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export async function tasksRoutes(server: FastifyInstance) {
  server.post('/creating-task', async (request) => {
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

  server.patch('/edit-task/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      name: z.string(),
      date: z.string(),
      task: z.string(),
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

  
}