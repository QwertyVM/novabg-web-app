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
    const response = await fetch(url);
    
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
    
    const item = result.items?.item;
    
    if (!item) {
        return null;
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
