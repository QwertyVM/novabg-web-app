import { XMLParser } from 'fast-xml-parser';

export interface BGGGameInfo {
  bggId: number;
  bggRating?: number;
  bggWeight?: number;
  bggMinPlayers?: number;
  bggMaxPlayers?: number;
  bggPlaytime?: number;
}

/**
 * Obtiene la información de un juego de mesa desde la API de BGG.
 * @param bggId El ID del juego en BoardGameGeek.
 * @returns La información relevante del juego, o null si falla.
 */
export async function getBGGGameInfo(bggId: number): Promise<BGGGameInfo | null> {
  try {
    const url = `https://boardgamegeek.com/xmlapi2/thing?id=${bggId}&stats=1`;
    // Añadimos headers para simular un navegador real y evitar el bloqueo 401/403 en Vercel
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      cache: 'no-store' // Forzar a no usar caché temporalmente para ver si funciona
    });
    
    if (!response.ok) {
      console.error(`Error fetching BGG data for ID ${bggId}: ${response.statusText}`);
      return null;
    }

    const xmlData = await response.text();
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    
    const result = parser.parse(xmlData);
    
    let item = result.items?.item;
    
    if (!item) {
        return null;
    }

    // Si BGG devuelve un array, tomamos el primer elemento
    if (Array.isArray(item)) {
      item = item[0];
    }

    // El API de BGG puede devolver arrays u objetos dependiendo de la estructura
    // Asumimos un parseo básico usando los atributos
    
    const bggRating = parseFloat(item.statistics?.ratings?.average?.['@_value']) || undefined;
    const bggWeight = parseFloat(item.statistics?.ratings?.averageweight?.['@_value']) || undefined;
    const bggMinPlayers = parseInt(item.minplayers?.['@_value'], 10) || undefined;
    const bggMaxPlayers = parseInt(item.maxplayers?.['@_value'], 10) || undefined;
    const bggPlaytime = parseInt(item.playingtime?.['@_value'], 10) || undefined;

    return {
      bggId,
      bggRating,
      bggWeight,
      bggMinPlayers,
      bggMaxPlayers,
      bggPlaytime,
    };
  } catch (error) {
    console.error('Error parsing BGG data:', error);
    return null;
  }
}
