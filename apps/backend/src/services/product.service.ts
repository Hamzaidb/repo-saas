// src/services/product.service.ts
import { PrismaClient } from '@prisma/client';

export class ProductService {
  constructor(private prisma: PrismaClient) {}

  async getAllProducts() {
    return this.prisma.products.findMany({
      include: {
        categories: true, 
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getProductById(id: string) {

    const productId = BigInt(id);
    
    return this.prisma.products.findUnique({
      where: { id: productId },
      include: {
        categories: true, 
      },
    });
  }

  async createProduct(data: any) {
  
    const productData = {
      ...data,
      category_id: data.category_id ? BigInt(data.category_id) : null,
    };

    return this.prisma.products.create({
      data: productData,
      include: {
        categories: true,
      },
    });
  }

  async updateProduct(id: string, data: any) {
    try {
      const productId = BigInt(id);
      const productData = {
        ...data,
        category_id: data.category_id ? BigInt(data.category_id) : undefined,
      };

      return await this.prisma.products.update({
        where: { id: productId },
        data: productData,
        include: {
          categories: true,
        },
      });
    } catch (error) {
      return null;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const productId = BigInt(id);
      await this.prisma.products.delete({
        where: { id: productId },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAllCategories() {
    return this.prisma.categories.findMany({
      include: {
        products: true, 
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getProductsByCategory(categoryId: string) {
    const catId = BigInt(categoryId);
    
    return this.prisma.products.findMany({
      where: { category_id: catId },
      include: {
        categories: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async searchProducts(searchTerm: string) {
    return this.prisma.products.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
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
  }
}