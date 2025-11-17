
import { useState, useEffect } from 'react';

interface TimestampProps {
  timestamp: Date;
}

interface TimeUnit {
  value: number;
  label: string;
  shortLabel: string;
}

export default function Timestamp({ timestamp }: TimestampProps) {

  const [currentTime, setCurrentTime] = useState(new Date());

  // Mettre à jour le temps actuel chaque seconde
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Nettoyer l'interval quand le composant est démonté
    return () => clearInterval(interval);
  }, []);
  
  // Calculer la différence en millisecondes
  const timeDifference = timestamp.getTime() - currentTime.getTime();
  const isOverdue = timeDifference < 0;
  const absTimeDifference = Math.abs(timeDifference);

  // Calculer les années, mois, semaines, jours, heures, minutes et secondes
  const years = Math.floor(absTimeDifference / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor((absTimeDifference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  const weeks = Math.floor((absTimeDifference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7));
  const days = Math.floor((absTimeDifference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absTimeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absTimeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absTimeDifference % (1000 * 60)) / 1000);

  // Créer un tableau des unités de temps avec leurs valeurs
  const timeUnits: TimeUnit[] = [
    { value: years, label: 'years', shortLabel: 'ans' },
    { value: months, label: 'months', shortLabel: 'mois' },
    { value: weeks, label: 'weeks', shortLabel: 'sem' },
    { value: days, label: 'days', shortLabel: 'jours' },
    { value: hours, label: 'hours', shortLabel: 'h' },
    { value: minutes, label: 'minutes', shortLabel: 'min' },
    { value: seconds, label: 'seconds', shortLabel: 'sec' }
  ];

  // Filtrer pour n'afficher que les unités nécessaires
  // On trouve la première unité non-nulle et on affiche à partir de là
  const firstNonZeroIndex = timeUnits.findIndex(unit => unit.value > 0);
  const displayUnits = firstNonZeroIndex === -1 
    ? [timeUnits[timeUnits.length - 1]] // Si tout est à 0, afficher seulement les secondes
    : timeUnits.slice(firstNonZeroIndex);

  const counter = displayUnits
    .map(unit => `${unit.value} ${unit.label}`)
    .join(', ');

  const countdownClasses = `countdown font-mono text-5xl ${isOverdue ? 'text-red-400' : ''}`;
  const labelClasses = 'text-lg';

  const renderTimeUnit = (unit: TimeUnit) => (
    <div key={unit.label}>
      <span className={countdownClasses}>
        <span 
          style={{"--value": unit.value} as React.CSSProperties} 
          aria-live="polite" 
          aria-label={counter}
        >
          {unit.value}
        </span>
      </span>
      <span className={labelClasses}>{unit.shortLabel}</span>
    </div>
  );

  return (
    <div className="flex gap-7">
      {displayUnits.map(renderTimeUnit)}
    </div>
  )
}