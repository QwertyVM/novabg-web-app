/**
 * BoardGameGeek (BGG) API utility
 * Uses the BGG XML API v2 to search games and fetch ratings.
 * Docs: https://boardgamegeek.com/wiki/page/BGG_XML_API2
 */

const BGG_BASE = 'https://boardgamegeek.com/xmlapi2'
const BGG_CACHE_HOURS = 24 // Re-fetch rating every 24 hours

export interface BggRatingResult {
  bggId: number
  rating: number      // average rating 0-10
  ratingCount: number
}

/**
 * Search BGG for a board game by name. Returns the best matching game ID.
 */
export async function searchBggGame(name: string): Promise<number | null> {
  try {
    const url = `${BGG_BASE}/search?type=boardgame&query=${encodeURIComponent(name)}&exact=1`
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) return null

    const xml = await res.text()
    // Parse first <item> id attribute
    const match = xml.match(/<item type="boardgame" id="(\d+)"/)
    if (match) return parseInt(match[1], 10)

    // Fallback: fuzzy search without exact
    const url2 = `${BGG_BASE}/search?type=boardgame&query=${encodeURIComponent(name)}`
    const res2 = await fetch(url2, { next: { revalidate: 86400 } })
    if (!res2.ok) return null
    const xml2 = await res2.text()
    const match2 = xml2.match(/<item type="boardgame" id="(\d+)"/)
    if (match2) return parseInt(match2[1], 10)

    return null
  } catch {
    return null
  }
}

/**
 * Fetch the rating for a BGG game by ID.
 */
export async function fetchBggRating(bggId: number): Promise<BggRatingResult | null> {
  try {
    const url = `${BGG_BASE}/thing?id=${bggId}&stats=1`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return null

    const xml = await res.text()

    // <average value="7.5234"/>
    const avgMatch = xml.match(/<average value="([\d.]+)"/)
    // <usersrated value="12345"/>
    const votesMatch = xml.match(/<usersrated value="(\d+)"/)

    if (!avgMatch) return null

    return {
      bggId,
      rating: parseFloat(parseFloat(avgMatch[1]).toFixed(1)),
      ratingCount: votesMatch ? parseInt(votesMatch[1], 10) : 0,
    }
  } catch {
    return null
  }
}

/**
 * Returns true if the stored rating needs a refresh (older than BGG_CACHE_HOURS).
 */
export function needsBggRefresh(updatedAt: Date | null | undefined): boolean {
  if (!updatedAt) return true
  const ageMs = Date.now() - new Date(updatedAt).getTime()
  return ageMs > BGG_CACHE_HOURS * 60 * 60 * 1000
}
