import { FastifyInstance } from 'fastify';
import productRoutes from './products';

export default async function apiRoutes(fastify: FastifyInstance) {
  await fastify.register(productRoutes, { prefix: '/products' });
}