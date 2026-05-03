import React, { useEffect, useRef, useState, useCallback } from 'react';

// Color for each bar state
const BAR_COLORS = {
  default: '#2a2a45',
  compare: '#ffd60a',
  active: '#00e5ff',
  merge: '#b44fff',
  sorted: '#39ff14',
  done: '#39ff14'
};

export default function SortVisualizer({ steps, label, color, isPlaying, speed, onDone }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [array, setArray] = useState([]);
  const [highlights, setHighlights] = useState({ type: 'default', indices: [] });
  const intervalRef = useRef(null);
  const stepRef = useRef(0);

  useEffect(() => {
    if (!steps || steps.length === 0) return;
    setCurrentStep(0);
    stepRef.current = 0;
    setArray(steps[0]?.array || []);
    setHighlights({ type: 'default', indices: [] });
  }, [steps]);

  const tick = useCallback(() => {
    if (!steps || stepRef.current >= steps.length) {
      clearInterval(intervalRef.current);
      onDone?.();
      return;
    }
    const step = steps[stepRef.current];
    setArray([...step.array]);
    setHighlights({ type: step.type, indices: step.indices || [] });
    setCurrentStep(stepRef.current);
    stepRef.current++;
  }, [steps, onDone]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (isPlaying && steps?.length > 0) {
      const delay = Math.max(8, 300 - speed * 2.8);
      intervalRef.current = setInterval(tick, delay);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, tick, steps]);

  if (!array.length) return (
    <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
      Waiting for array...
    </div>
  );

  const max = Math.max(...array);
  const isDone = currentStep >= (steps?.length || 0) - 1;
  const progress = steps ? (currentStep / steps.length) * 100 : 0;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ color, fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>
          {label}
        </span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
            step {currentStep}/{steps?.length || 0}
          </span>
          {isDone && (
            <span style={{ color: 'var(--sorted)', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              ✓ SORTED
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'var(--border)', borderRadius: 1, marginBottom: 12, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: isDone ? 'var(--sorted)' : color,
          transition: 'width 0.1s linear',
          boxShadow: `0 0 6px ${color}`
        }} />
      </div>

      {/* Bars */}
      <div style={{
        height: 200,
        background: 'var(--bg)',
        borderRadius: 6,
        padding: '8px 8px 0',
        overflowX: 'auto',
        overflowY: 'hidden',
        border: '1px solid var(--border)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: array.length > 1000 ? 1 : array.length > 500 ? 2 : 3,
          width: 'max-content',
          minWidth: '100%',
          height: '100%'
        }}>
          {array.map((val, i) => {
            const isCompare = highlights.indices?.includes(i) && highlights.type === 'compare';
            const isActive = highlights.indices?.includes(i) && (highlights.type === 'set' || highlights.type === 'vector_merge' || highlights.type === 'merge');
            const barColor = isDone ? BAR_COLORS.done
              : isCompare ? BAR_COLORS.compare
              : isActive ? BAR_COLORS.active
              : BAR_COLORS.default;

            return (
              <div
                key={i}
                style={{
                  width: array.length > 1500 ? 1 : array.length > 700 ? 2 : 3,
                  flexShrink: 0,
                  height: `${(val / max) * 95}%`,
                  background: barColor,
                  borderRadius: '1px 1px 0 0',
                  transition: isCompare || isActive ? 'none' : 'height 0.05s ease',
                  boxShadow: isCompare ? `0 0 6px ${BAR_COLORS.compare}` : isActive ? `0 0 4px ${color}` : 'none'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        {[
          { color: BAR_COLORS.default, label: 'unsorted' },
          { color: BAR_COLORS.compare, label: 'comparing' },
          { color: color, label: 'active' },
          { color: BAR_COLORS.done, label: 'sorted' }
        ].map(({ color: c, label: l }) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, background: c, borderRadius: 1 }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}