import { XMLParser } from 'fast-xml-parser';

export interface BGGGameInfo {
  bggId: number;
  bggRating?: number;
  bggRatingCount?: number;
  bggWeight?: number;
  bggMinPlayers?: number;
  bggMaxPlayers?: number;
  bggPlaytime?: number;
  edadMinima?: number;
  duracionMinutos?: number;
  numJugadores?: string;
  editorialMarca?: string;
  mecanicas?: string;
}

const BGG_API_TOKEN = process.env.BGG_API_TOKEN || 'f7ad4bda-0a75-4d1c-9ee0-bb8417ea409f';

const MECHANIC_TRANSLATIONS: Record<string, string> = {
  'Hidden Roles': 'Roles Ocultos',
  'Player Elimination': 'Eliminación de Jugadores',
  'Voting': 'Votación',
  'Variable Player Powers': 'Poderes Variables',
  'Deduction': 'Deducción',
  'Bluffing': 'Faroleo / Engaño',
  'Hand Management': 'Gestión de Mano',
  'Set Collection': 'Colección de Sets',
  'Drafting': 'Drafting de Cartas',
  'Card Drafting': 'Drafting de Cartas',
  'Dice Rolling': 'Tirada de Dados',
  'Worker Placement': 'Colocación de Trabajadores',
  'Tile Placement': 'Colocación de Losetas',
  'Cooperative Game': 'Cooperativo',
  'Area Majority / Influence': 'Control de Área',
  'Auction / Bidding': 'Subasta / Puja',
  'Pattern Building': 'Construcción de Patrones',
  'Pattern Recognition': 'Reconocimiento de Patrones',
  'Speed Matching': 'Velocidad y Reflejos',
  'Memory': 'Memoria',
  'Push Your Luck': 'Prueba tu Suerte',
  'Take That': 'Ataque Directo',
  'Team-Based Game': 'Por Equipos',
  'Role Playing': 'Juego de Rol',
  'Grid Movement': 'Movimiento en Cuadrícula',
  'Modular Board': 'Tablero Modular',
  'Simultaneous Action Selection': 'Selección Simultánea',
  'Network and Route Building': 'Construcción de Rutas',
  'Trading': 'Comercio / Negociación',
  'Pick-up and Deliver': 'Recoger y Entregar',
};

const PREFERRED_PUBLISHERS = [
  'Devir',
  'Asmodee',
  'Maldito Games',
  'Zacatrus',
  'SD Games',
  'TCG Factory',
  'Tranjis Games',
  'Morapiaf',
  'MasQueOca',
  'GDM Games',
  'Ludo',
  'Lui-même',
  'Zoch Verlag',
  'Repos Production',
  'Days of Wonder',
  'Catan Studio',
  'Kosmos',
  'Ravensburger',
  'Fantasy Flight Games',
  'Stonemaier Games',
  'Lookout Games',
];

/**
 * Obtiene la información completa de múltiples juegos en UNA SOLA llamada HTTP a BGG.
 * Extrae tanto estadísticas como los datos de la Ficha Técnica (jugadores, edad, duración, editorial, mecánicas).
 * @param bggIds Lista de IDs de BGG a consultar.
 * @returns Map indexado por bggId con las estadísticas y ficha técnica del juego.
 */
export async function getBGGGamesBatch(bggIds: number[]): Promise<Map<number, BGGGameInfo>> {
  const results = new Map<number, BGGGameInfo>();
  const validIds = Array.from(new Set(bggIds.filter((id) => typeof id === 'number' && id > 0)));

  if (validIds.length === 0) return results;

  // BGG soporta cómodamente hasta 50 IDs por llamada HTTP
  const CHUNK_SIZE = 50;
  const chunks: number[][] = [];
  for (let i = 0; i < validIds.length; i += CHUNK_SIZE) {
    chunks.push(validIds.slice(i, i + CHUNK_SIZE));
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const idsParam = chunk.join(',');
    const url = `https://boardgamegeek.com/xmlapi2/thing?id=${idsParam}&stats=1`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${BGG_API_TOKEN}`,
          'User-Agent': 'BGG-Personal-Collection-Tracker/1.0 (hobby project)',
          Accept: 'application/xml,text/xml,*/*',
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

        // Ratings y Stats
        const bggRating = parseFloat(item.statistics?.ratings?.average?.['@_value']) || undefined;
        const bggWeight = parseFloat(item.statistics?.ratings?.averageweight?.['@_value']) || undefined;
        const bggRatingCount = parseInt(item.statistics?.ratings?.usersrated?.['@_value'], 10) || undefined;

        // Jugadores y Tiempo
        const bggMinPlayers = parseInt(item.minplayers?.['@_value'], 10) || undefined;
        const bggMaxPlayers = parseInt(item.maxplayers?.['@_value'], 10) || undefined;
        const bggPlaytime = parseInt(item.playingtime?.['@_value'], 10) || undefined;

        // Ficha Técnica
        const minAgeVal = parseInt(item.minage?.['@_value'], 10) || undefined;
        const edadMinima = minAgeVal && minAgeVal > 0 ? minAgeVal : undefined;
        const duracionMinutos = bggPlaytime && bggPlaytime > 0 ? bggPlaytime : undefined;

        let numJugadores: string | undefined = undefined;
        if (bggMinPlayers && bggMaxPlayers) {
          numJugadores =
            bggMinPlayers === bggMaxPlayers
              ? `${bggMinPlayers} jugadores`
              : `${bggMinPlayers} - ${bggMaxPlayers} jugadores`;
        } else if (bggMinPlayers) {
          numJugadores = `${bggMinPlayers}+ jugadores`;
        }

        // Links: Editorial y Mecánicas
        const links = Array.isArray(item.link) ? item.link : item.link ? [item.link] : [];

        const publishers: string[] = links
          .filter((l: any) => l?.['@_type'] === 'boardgamepublisher')
          .map((l: any) => l?.['@_value'])
          .filter(Boolean);

        const preferredPub =
          publishers.find((p) =>
            PREFERRED_PUBLISHERS.some((pref) => p.toLowerCase().includes(pref.toLowerCase()))
          ) || publishers[0];
        const editorialMarca = preferredPub || undefined;

        const mechanics: string[] = links
          .filter((l: any) => l?.['@_type'] === 'boardgamemechanic')
          .map((l: any) => l?.['@_value'])
          .filter(Boolean);

        const translatedMechanics = mechanics
          .slice(0, 4)
          .map((m) => MECHANIC_TRANSLATIONS[m] || m);
        const mecanicas =
          translatedMechanics.length > 0 ? translatedMechanics.join(', ') : undefined;

        results.set(id, {
          bggId: id,
          bggRating: bggRating ? parseFloat(bggRating.toFixed(2)) : undefined,
          bggRatingCount,
          bggWeight: bggWeight ? parseFloat(bggWeight.toFixed(2)) : undefined,
          bggMinPlayers,
          bggMaxPlayers,
          bggPlaytime,
          edadMinima,
          duracionMinutos,
          numJugadores,
          editorialMarca,
          mecanicas,
        });
      }

      // Si hubiera más de 50 juegos (múltiples chunks), cortesía
      if (i < chunks.length - 1) {
        await new Promise((r) => setTimeout(r, 2000));
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
