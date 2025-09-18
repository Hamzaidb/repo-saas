// src/plugins/prisma.ts
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '../generated/prisma/client';
import fp from 'fastify-plugin';

// Déclarer le type pour TypeScript
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
    // Connecter à la base de données
    await prisma.$connect();
    console.log('✅ Prisma connected successfully');

    // Ajouter prisma à l'instance Fastify
    fastify.decorate('prisma', prisma);
    
    console.log('✅ Prisma decorated on Fastify instance');

    // Déconnecter quand l'app se ferme
    fastify.addHook('onClose', async (fastify) => {
      console.log('🔌 Disconnecting Prisma...');
      await fastify.prisma.$disconnect();
    });
    
  } catch (error) {
    console.error('❌ Failed to connect Prisma:', error);
    throw error;
  }
}

// Export avec fastify-plugin
export default fp(prismaPlugin, {
  name: 'prisma-plugin'
});