import React, { JSX, useEffect, useState } from 'react';

export const Celebration: React.FC = () => {
  const [confetti, setConfetti] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    const particles = Array(4).fill(null).map((_, i) => {
      const style = {
        left: `${Math.random() * 100}%`,
        color: colors[i % colors.length],
        animationDelay: `${i * 0.1}s`,
        fontSize: `${Math.random() * 20 + 20}px`
      };
      return <div key={i} className="confetti" style={style}>⭐</div>;
    });
    
    setConfetti(particles);
    return () => setConfetti([]);
  }, []);

  return <>{confetti}</>;
};