import { FastifyInstance } from 'fastify';
import productRoutes from './products';
import categoryRoutes from './categories';
import userRoutes from './users';
import billingRoutes from './billing';
import { authRoutes } from './auth';

export default async function apiRoutes(fastify: FastifyInstance) {
  await fastify.register(productRoutes, { prefix: '/products' });
  await fastify.register(categoryRoutes, { prefix: '/categories' });
  await fastify.register(userRoutes, { prefix: '/users' });
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(billingRoutes);
}