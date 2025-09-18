import Fastify, { FastifyInstance } from 'fastify';
import { config } from './config/env';

import prismaPlugin from './plugins/prisma';

import apiRoutes from './routes';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  });

  await app.register(prismaPlugin);

  await app.register(apiRoutes);

  app.get('/health', async () => ({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  }));

  return app;
}