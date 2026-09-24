import { XMLParser } from 'fast-xml-parser';

export interface BGGGameInfo {
  bggId: number;
  bggRating?: number;
  bggWeight?: number;
  bggMinPlayers?: number;
  bggMaxPlayers?: number;
  bggPlaytime?: number;
}

const BGG_API_TOKEN = process.env.BGG_API_TOKEN || 'f7ad4bda-0a75-4d1c-9ee0-bb8417ea409f';

/**
 * Obtiene la información de múltiples juegos en UNA SOLA llamada HTTP a BGG.
 * Admite lotes de hasta 50 juegos por llamada para máxima eficiencia y 0 spam.
 * @param bggIds Lista de IDs de BGG a consultar.
 * @returns Map indexado por bggId con las estadísticas del juego.
 */
export async function getBGGGamesBatch(bggIds: number[]): Promise<Map<number, BGGGameInfo>> {
  const results = new Map<number, BGGGameInfo>();
  const validIds = Array.from(new Set(bggIds.filter(id => typeof id === 'number' && id > 0)));

  if (validIds.length === 0) return results;

  // BGG soporta cómodamente hasta 50 IDs por llamada HTTP
  const CHUNK_SIZE = 50;
  const chunks: number[][] = [];
  for (let i = 0; i < validIds.length; i += CHUNK_SIZE) {
    chunks.push(validIds.slice(i, i + CHUNK_SIZE));
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
  });

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const idsParam = chunk.join(',');
    const url = `https://boardgamegeek.com/xmlapi2/thing?id=${idsParam}&stats=1`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${BGG_API_TOKEN}`,
          'User-Agent': 'BGG-Personal-Collection-Tracker/1.0 (hobby project)',
          'Accept': 'application/xml,text/xml,*/*',
        },
      });

      if (!response.ok) {
        console.error(`Error BGG API (${response.status}): ${response.statusText}`);
        continue;
      }

      const xmlData = await response.text();
      const parsed = parser.parse(xmlData);
      const rawItems = parsed.items?.item;
      const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

      for (const item of items) {
        const id = parseInt(item['@_id'], 10);
        if (!id) continue;

        const bggRating = parseFloat(item.statistics?.ratings?.average?.['@_value']) || undefined;
        const bggWeight = parseFloat(item.statistics?.ratings?.averageweight?.['@_value']) || undefined;
        const bggMinPlayers = parseInt(item.minplayers?.['@_value'], 10) || undefined;
        const maxPlayers = parseInt(item.maxplayers?.['@_value'], 10) || undefined;
        const playtime = parseInt(item.playingtime?.['@_value'], 10) || undefined;

        results.set(id, {
          bggId: id,
          bggRating: bggRating ? parseFloat(bggRating.toFixed(2)) : undefined,
          bggWeight: bggWeight ? parseFloat(bggWeight.toFixed(2)) : undefined,
          bggMinPlayers,
          bggMaxPlayers: maxPlayers,
          bggPlaytime: playtime,
        });
      }

      // Si hubiera más de 50 juegos (múltiples chunks), pausa de cortesía entre peticiones
      if (i < chunks.length - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (error) {
      console.error('Error fetching/parsing BGG batch:', error);
    }
  }

  return results;
}

/**
 * Obtiene la información de un único juego de mesa desde la API de BGG.
 * @param bggId El ID del juego en BoardGameGeek.
 * @returns La información relevante del juego, o null si falla.
 */
export async function getBGGGameInfo(bggId: number): Promise<BGGGameInfo | null> {
  const map = await getBGGGamesBatch([bggId]);
  return map.get(bggId) || null;
}
