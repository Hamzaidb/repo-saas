import { FastifyInstance } from 'fastify';
import productRoutes from './products';
import categoryRoutes from './categories';
import userRoutes from './users';
import billingRoutes from './billing';

export default async function apiRoutes(fastify: FastifyInstance) {
  await fastify.register(productRoutes, { prefix: '/products' });
  await fastify.register(categoryRoutes, { prefix: '/categories' });
  await fastify.register(userRoutes, { prefix: '/users' });
  await fastify.register(billingRoutes);
}