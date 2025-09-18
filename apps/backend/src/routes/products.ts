import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodError } from 'zod';

const productParamsSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
});

function transformBigInt(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(transformBigInt);
  }
  
  if (typeof obj === 'object') {
    const transformed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      transformed[key] = transformBigInt(value);
    }
    return transformed;
  }
  
  return obj;
}

export default async function productRoutes(fastify: FastifyInstance) {

  // GET /products - Récupérer tous les produits
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const products = await fastify.prisma.products.findMany({
        include: {
          categories: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      
      const transformedProducts = transformBigInt(products);
      
      return { data: transformedProducts };
    } catch (error) {
      fastify.log.error('Error in getAllProducts:', error);
      reply.status(500).send({ error: 'Failed to fetch products' });
    }
  });

  // GET /products/:id - Récupérer un produit par ID
  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = productParamsSchema.parse(request.params);
      
      const productId = BigInt(id);
      
      const product = await fastify.prisma.products.findUnique({
        where: { id: productId },
        include: {
          categories: true,
        },
      });
      
      if (!product) {
        reply.status(404).send({ error: 'Product not found' });
        return;
      }
      
      const transformedProduct = transformBigInt(product);
      
      return { data: transformedProduct };
    } catch (error) {
      if (error instanceof ZodError) {
        reply.status(400).send({ 
          error: 'Invalid product ID', 
          details: error.issues 
        });
        return;
      }
      
      if (error instanceof RangeError || error.message?.includes('BigInt')) {
        reply.status(400).send({ error: 'Invalid product ID format' });
        return;
      }
      
      fastify.log.error('Error in getProductById:', error);
      reply.status(500).send({ error: 'Failed to fetch product' });
    }
  });

  // GET /products/category/:categoryId - Récupérer les produits d'une catégorie
  fastify.get('/category/:categoryId', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { categoryId } = request.params as { categoryId: string };
      const catId = BigInt(categoryId);
      
      const products = await fastify.prisma.products.findMany({
        where: { category_id: catId },
        include: {
          categories: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      
      const transformedProducts = transformBigInt(products);
      
      return { data: transformedProducts };
    } catch (error) {
      if (error instanceof RangeError || error.message?.includes('BigInt')) {
        reply.status(400).send({ error: 'Invalid category ID format' });
        return;
      }
      
      fastify.log.error('Error in getProductsByCategory:', error);
      reply.status(500).send({ error: 'Failed to fetch products by category' });
    }
  });

  // GET /products/search/:term - Rechercher des produits
  fastify.get('/search/:term', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { term } = request.params as { term: string };
      
      const products = await fastify.prisma.products.findMany({
        where: {
          OR: [
            {
              name: {
                contains: term,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: term,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: {
          categories: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      
      const transformedProducts = transformBigInt(products);
      
      return { data: transformedProducts };
    } catch (error) {
      fastify.log.error('Error in searchProducts:', error);
      reply.status(500).send({ error: 'Failed to search products' });
    }
  });
}