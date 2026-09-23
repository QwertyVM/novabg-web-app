import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const product = await prisma.producto.findFirst({
    where: {
      nombreModelo: {
        contains: 'Fantasma',
        mode: 'insensitive'
      }
    }
  });
  console.log(product);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
