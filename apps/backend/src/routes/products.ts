import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodError } from 'zod';

const productParamsSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
});

// Fonction pour transformer les données Prisma en format JSON propre
function transformProductData(product: any) {
  return {
    ...product,
    price: product.price ? parseFloat(product.price.toString()) : 0,
    created_at: product.created_at ? product.created_at.toISOString() : null,
  };
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
      
      const transformedProducts = products.map(transformProductData);
      
      return { data: transformedProducts };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      fastify.log.error(`Error in getAllProducts: ${errorMessage}`);
      reply.status(500).send({ error: 'Failed to fetch products' });
    }
  });

  // GET /products/:id - Récupérer un produit par ID
  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = productParamsSchema.parse(request.params);
      
      // Plus besoin de conversion BigInt, l'ID est directement utilisable
      const product = await fastify.prisma.products.findUnique({
        where: { id },
        include: {
          categories: true,
        },
      });
      
      if (!product) {
        reply.status(404).send({ error: 'Product not found' });
        return;
      }
      
      const transformedProduct = transformProductData(product);
      
      return { data: transformedProduct };
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        reply.status(400).send({ 
          error: 'Invalid product ID', 
          details: error.issues 
        });
        return;
      }
      
      fastify.log.error({ error, msg: 'Error in getProductById' });
      reply.status(500).send({ error: 'Failed to fetch product' });
    }
  });

  // GET /products/category/:categoryId - Récupérer les produits d'une catégorie
  fastify.get('/category/:categoryId', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { categoryId } = request.params as { categoryId: string };
      
      // categoryId est maintenant un CUID string, pas besoin de conversion
      const products = await fastify.prisma.products.findMany({
        where: { category_id: categoryId },
        include: {
          categories: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      
      const transformedProducts = products.map(transformProductData);
      
      return { data: transformedProducts };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      fastify.log.error(`Error in getProductsByCategory: ${errorMessage}`);
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
      
      const transformedProducts = products.map(transformProductData);
      
      return { data: transformedProducts };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      fastify.log.error(`Error in searchProducts: ${errorMessage}`);
      reply.status(500).send({ error: 'Failed to search products' });
    }
  });
}