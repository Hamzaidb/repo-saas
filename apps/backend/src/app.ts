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

  // IMPORTANT: Do not override JSON parsing for all routes.
  // We only need a raw body for the Stripe webhook route.
  app.addContentTypeParser('application/json', { parseAs: 'string' }, (req, payload, done) => {
    if (req.url?.startsWith('/webhooks/stripe')) {
      // Preserve an exact raw buffer for Stripe signature verification
      (req as any).rawBody = Buffer.from(payload as string);
      // Do not parse JSON here; webhook handler will use rawBody
      return done(null, payload);
    }
    try {
      const json = JSON.parse(payload as string);
      done(null, json);
    } catch (err) {
      done(err as Error);
    }
  });

  app.get('/health', async () => ({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  }));

  return app;
}