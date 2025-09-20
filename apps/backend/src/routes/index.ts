import { FastifyInstance } from 'fastify';
import productRoutes from './products';
import categoryRoutes from './categories';

export default async function apiRoutes(fastify: FastifyInstance) {
  await fastify.register(productRoutes, { prefix: '/products' });
  await fastify.register(categoryRoutes, { prefix: '/categories' });
}