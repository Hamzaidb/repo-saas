import { FastifyInstance } from 'fastify';
import { PrismaClient } from '../generated/prisma/client';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

async function prismaPlugin(fastify: FastifyInstance) {
  console.log('🔌 Initializing Prisma plugin...');
  
  const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
  });

  try {
    await prisma.$connect();
    console.log(' Prisma connected successfully');

    fastify.decorate('prisma', prisma);
    
    console.log(' Prisma decorated on Fastify instance');

    fastify.addHook('onClose', async (fastify) => {
      console.log('🔌 Disconnecting Prisma...');
      await fastify.prisma.$disconnect();
    });
    
  } catch (error) {
    console.error(' Failed to connect Prisma:', error);
    throw error;
  }
}

export default fp(prismaPlugin, {
  name: 'prisma-plugin'
});