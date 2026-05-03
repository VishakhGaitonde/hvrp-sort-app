import React from 'react';

// A single bar in the sorting visualization.
// Handles its own color state based on the current highlight type.
export default function ArrayBar({ value, maxValue, state, width, gap }) {
  const heightPct = Math.max(2, (value / maxValue) * 95);

  const colorMap = {
    default:   '#2a2a45',
    compare:   '#ffd60a',   // yellow — elements being compared
    active:    '#00e5ff',   // cyan  — element being placed / written
    merge:     '#b44fff',   // purple — merge operation
    sorted:    '#39ff14',   // green  — final sorted position
    pivot:     '#ff6b35',   // orange — pivot (reserved for future quicksort)
  };

  const color = colorMap[state] || colorMap.default;
  const isHighlighted = state !== 'default' && state !== 'sorted';

  return (
    <div
      style={{
        width,
        flexShrink: 0,
        marginRight: gap,
        height: `${heightPct}%`,
        background: color,
        borderRadius: '1px 1px 0 0',
        alignSelf: 'flex-end',
        transition: isHighlighted ? 'none' : 'height 0.04s ease',
        boxShadow: state === 'compare'
          ? '0 0 6px #ffd60a88'
          : state === 'active'
          ? '0 0 4px #00e5ff88'
          : state === 'sorted'
          ? '0 0 3px #39ff1444'
          : 'none',
        willChange: 'height',
      }}
      title={`value: ${value}`}
    />
  );
}