import { PrismaClient } from '@prisma/client';
import { getBGGGamesBatch } from './src/features/catalog/services/bgg.service';

const prisma = new PrismaClient();

async function main() {
  console.log('🎲 Iniciando sincronización masiva con BoardGameGeek (1 sola llamada HTTP)...');

  // Buscar todos los productos que tengan un bggId
  const productos = await prisma.producto.findMany({
    where: {
      bggId: {
        not: null,
      },
    },
  });

  const validProducts = productos.filter((p) => p.bggId != null && p.bggId > 0);
  console.log(`📦 Se encontraron ${validProducts.length} productos con ID de BGG en la base de datos.`);

  if (validProducts.length === 0) {
    console.log('ℹ️ No hay productos con BGG ID registrados para sincronizar.');
    return;
  }

  const bggIds = validProducts.map((p) => p.bggId as number);
  console.log(`🚀 Consultando BGG para los IDs: [${bggIds.join(', ')}] en una sola llamada...`);

  const startTime = Date.now();
  const bggDataMap = await getBGGGamesBatch(bggIds);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`⚡ Respuesta recibida de BGG en ${elapsed}s. Guardando en base de datos PostgreSQL...`);

  let successCount = 0;
  for (const product of validProducts) {
    const bggData = bggDataMap.get(product.bggId!);
    if (bggData) {
      await prisma.producto.update({
        where: { id: product.id },
        data: {
          bggRating: bggData.bggRating ?? null,
          bggWeight: bggData.bggWeight ?? null,
          bggMinPlayers: bggData.bggMinPlayers ?? null,
          bggMaxPlayers: bggData.bggMaxPlayers ?? null,
          bggPlaytime: bggData.bggPlaytime ?? null,
          bggRatingUpdatedAt: new Date(),
        },
      });
      console.log(
        `✅ [${product.nombreModelo}] -> Rating: ${bggData.bggRating}★ | Peso: ${bggData.bggWeight}/5 | Jugadores: ${bggData.bggMinPlayers}-${bggData.bggMaxPlayers} | ${bggData.bggPlaytime} min`
      );
      successCount++;
    } else {
      console.log(`⚠️ [${product.nombreModelo}] (ID ${product.bggId}) no devolvió estadísticas en BGG.`);
    }
  }

  console.log(`\n🎉 Sincronización completada: ${successCount}/${validProducts.length} juegos actualizados en la base de datos.`);
}

main()
  .catch((e) => {
    console.error('Error general:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
