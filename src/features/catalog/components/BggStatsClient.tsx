"use client";

import React, { useEffect, useState } from 'react';
import { XMLParser } from 'fast-xml-parser';
import { BggStatsBadge, BggStatsProps } from './BggStatsBadge';

interface BggStatsClientProps {
  bggId: number;
}

export function BggStatsClient({ bggId }: BggStatsClientProps) {
  const [data, setData] = useState<BggStatsProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchBggData() {
      try {
        const url = `https://boardgamegeek.com/xmlapi2/thing?id=${bggId}&stats=1`;
        // Hacemos el fetch desde el navegador, lo que evade el bloqueo de Vercel
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Error al conectar con BGG');
        }

        const xmlText = await response.text();
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "@_"
        });
        
        const result = parser.parse(xmlText);
        let item = result.items?.item;

        if (!item) {
          throw new Error('Sin items devueltos');
        }

        if (Array.isArray(item)) {
          item = item[0];
        }

        const rating = parseFloat(item.statistics?.ratings?.average?.['@_value']) || undefined;
        const weight = parseFloat(item.statistics?.ratings?.averageweight?.['@_value']) || undefined;
        const minPlayers = parseInt(item.minplayers?.['@_value'], 10) || undefined;
        const maxPlayers = parseInt(item.maxplayers?.['@_value'], 10) || undefined;
        const playtime = parseInt(item.playingtime?.['@_value'], 10) || undefined;

        if (isMounted) {
          setData({
            bggId,
            rating,
            weight,
            minPlayers,
            maxPlayers,
            playtime
          });
        }
      } catch (error) {
        console.error('Error fetching BGG data client-side:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchBggData();

    return () => {
      isMounted = false;
    };
  }, [bggId]);

  if (loading) {
    // Puedes poner un skeleton o dejarlo vacío mientras carga
    return <div className="h-8 my-4 animate-pulse bg-gray-100 dark:bg-gray-800 rounded w-1/3"></div>;
  }

  if (!data) {
    return null;
  }

  return <BggStatsBadge {...data} />;
}
