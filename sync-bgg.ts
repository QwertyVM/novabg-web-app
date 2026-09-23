import { PrismaClient } from '@prisma/client';
import { getBGGGameInfo } from './src/features/catalog/services/bgg.service';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando sincronización con BoardGameGeek...');
  
  // Buscar todos los productos que tengan un bggId
  const productos = await prisma.producto.findMany({
    where: {
      bggId: {
        not: null
      }
    }
  });

  console.log(`Se encontraron ${productos.length} productos con ID de BGG.`);

  for (const product of productos) {
    if (!product.bggId) continue;
    
    console.log(`\nConsultando BGG para: ${product.nombreModelo} (ID: ${product.bggId})`);
    
    // Obtenemos info usando nuestro servicio
    const bggData = await getBGGGameInfo(product.bggId);
    
    if (bggData) {
      // Actualizamos la base de datos con los resultados
      await prisma.producto.update({
        where: { id: product.id },
        data: {
          bggRating: bggData.bggRating ? parseFloat(bggData.bggRating.toFixed(2)) : null,
          bggWeight: bggData.bggWeight ? parseFloat(bggData.bggWeight.toFixed(2)) : null,
          bggMinPlayers: bggData.bggMinPlayers,
          bggMaxPlayers: bggData.bggMaxPlayers,
          bggPlaytime: bggData.bggPlaytime,
          bggRatingUpdatedAt: new Date(),
        }
      });
      console.log(`✅ ¡Éxito! Base de datos actualizada para ${product.nombreModelo}.`);
      console.log(`   Rating: ${bggData.bggRating} | Peso: ${bggData.bggWeight}`);
    } else {
      console.log(`❌ No se pudo obtener la información de BGG para este producto.`);
    }

    // Pequeña pausa para no saturar a BGG si hay muchos productos (1 segundo)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\nSincronización completada.');
}

main()
  .catch(e => {
    console.error('Error general:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
