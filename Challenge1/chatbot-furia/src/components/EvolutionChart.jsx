import React from 'react';

export default function EvolutionChart({ history = [] }) {
  // history: [{ date: '2025-04-01', points: 100 }, ...]
  if (!history.length) return null;
  // Simples SVG line chart
  const width = 240;
  const height = 70;
  const maxPoints = Math.max(...history.map(h => h.points));
  const minPoints = Math.min(...history.map(h => h.points));
  const getX = idx => (width / (history.length - 1)) * idx;
  const getY = points => height - ((points - minPoints) / (maxPoints - minPoints || 1)) * (height - 18) - 8;

  return (
    <svg width={width} height={height} style={{ margin: '10px auto', display: 'block', background: '#232323', borderRadius: 8 }}>
      <polyline
        fill="none"
        stroke="#f9d923"
        strokeWidth="3"
        points={history.map((h, i) => `${getX(i)},${getY(h.points)}`).join(' ')}
      />
      {history.map((h, i) => (
        <circle key={i} cx={getX(i)} cy={getY(h.points)} r={4} fill="#f9d923" />
      ))}
    </svg>
  );
}
