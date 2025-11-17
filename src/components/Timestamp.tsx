
import { useState, useEffect } from 'react';

export default function Timestamp({ timestamp }: { timestamp: Date}) {

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

  // Calculer les jours, heures, minutes et secondes
  const days = Math.floor(absTimeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absTimeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absTimeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absTimeDifference % (1000 * 60)) / 1000);

  const prefix = isOverdue ? '-' : '';
  const counter = `${prefix}${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;

  return (
    <div className="flex gap-5">
      {
        isOverdue && (
          <span>-</span>
        )
      }
      <div>
        <span className="countdown font-mono text-4xl">
            <span style={{"--value":days} as React.CSSProperties } aria-live="polite" aria-label={counter}>{prefix}{days}</span>
        </span>
        days
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
            <span style={{"--value":hours} as React.CSSProperties } aria-live="polite" aria-label={counter}>{hours}</span>
        </span>
        hours
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span style={{"--value":minutes} as React.CSSProperties } aria-live="polite" aria-label={counter}>{minutes}</span>
        </span>
        min
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span style={{"--value":seconds} as React.CSSProperties } aria-live="polite" aria-label={counter}>{seconds}</span>
        </span>
        sec
      </div>
    </div>
  )
}