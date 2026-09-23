import React from 'react';
import { Star, Users, Clock, Brain } from 'lucide-react';

export interface BggStatsProps {
  rating?: number;
  weight?: number;
  minPlayers?: number;
  maxPlayers?: number;
  playtime?: number;
  bggId?: number;
}

export function BggStatsBadge({ 
  rating, 
  weight, 
  minPlayers, 
  maxPlayers, 
  playtime,
  bggId 
}: BggStatsProps) {
  // Si no hay datos, no mostramos nada
  if (!rating && !weight && !minPlayers && !playtime) {
    return null;
  }

  // BGG usa colores por rating. Esto es opcional, pero le da un toque muy premium.
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-600 text-white';
    if (rating >= 7) return 'bg-green-500 text-white';
    if (rating >= 6) return 'bg-yellow-500 text-white';
    if (rating >= 5) return 'bg-yellow-400 text-black';
    return 'bg-red-500 text-white';
  };

  const getWeightText = (weight: number) => {
    if (weight <= 1.5) return 'Familiar';
    if (weight <= 2.5) return 'Medio-Ligero';
    if (weight <= 3.5) return 'Medio-Pesado';
    return 'Experto';
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mt-4 mb-4">
      
      {/* Badge Principal del Rating estilo BGG */}
      {rating && (
        <a 
          href={bggId ? `https://boardgamegeek.com/boardgame/${bggId}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold shadow-sm transition-transform hover:scale-105 ${getRatingColor(rating)}`}
          title="Ver en BoardGameGeek"
        >
          <Star size={16} fill="currentColor" />
          <span>{rating.toFixed(1)}</span>
        </a>
      )}

      {/* Otras Estadísticas en estilo "píldora" sutil */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        
        {/* Jugadores */}
        {(minPlayers || maxPlayers) && (
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-700">
            <Users size={16} className="text-gray-500" />
            <span>
              {minPlayers === maxPlayers 
                ? `${minPlayers}` 
                : `${minPlayers} - ${maxPlayers}`}
            </span>
          </div>
        )}

        {/* Tiempo de Juego */}
        {playtime && (
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-700">
            <Clock size={16} className="text-gray-500" />
            <span>{playtime} min</span>
          </div>
        )}

        {/* Peso / Complejidad */}
        {weight && (
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-700">
            <Brain size={16} className="text-gray-500" />
            <span title={`Peso BGG: ${weight.toFixed(2)}/5`}>
              {getWeightText(weight)}
            </span>
          </div>
        )}
        
      </div>
    </div>
  );
}
