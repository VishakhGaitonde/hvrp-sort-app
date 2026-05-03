import React from 'react';

const INFO = {
  radix: {
    label: 'Radix Sort',
    color: 'var(--radix-color)',
    condition: 'n < 128',
    why: "For small arrays, Radix Sort's linear O(n·k) complexity and minimal overhead beats merge-based approaches. Cache fits entirely in L1.",
    icon: '⬡'
  },
  vectorized: {
    label: 'Vectorized Merge Sort (AVX2)',
    color: 'var(--vectorized-color)',
    condition: '128 ≤ n ≤ 8192',
    why: 'Mid-sized arrays benefit from SIMD parallelism. AVX2 processes 8 × int32 per register in a single cycle, drastically cutting merge time.',
    icon: '⬡⬡⬡⬡⬡⬡⬡⬡'
  },
  parallel: {
    label: 'Parallel Merge Sort',
    color: 'var(--parallel-color)',
    condition: 'n > 8192',
    why: 'Large arrays justify OpenMP thread spawn overhead. Multiple CPU cores divide and conquer in parallel, then merge — dominant for 8K+ elements.',
    icon: '⟳⟳⟳⟳'
  }
};

export default function AlgorithmInfo({ strategy, n, timeMs, mergeTimeMs }) {
  if (!strategy) return null;
  const info = INFO[strategy];
  const speedup = mergeTimeMs && timeMs ? (mergeTimeMs / timeMs).toFixed(2) : null;

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${info.color}`,
      borderRadius: 8,
      padding: '20px 24px',
      animation: 'fadeIn 0.4s ease',
      boxShadow: `0 0 20px ${info.color}22`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          background: `${info.color}22`,
          border: `1px solid ${info.color}`,
          borderRadius: 6,
          padding: '4px 10px',
          color: info.color,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1
        }}>
          HVRP SELECTED
        </div>
        <span style={{ color: info.color, fontWeight: 800, fontSize: 15 }}>
          {info.label}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
        <Chip label="Condition" value={info.condition} color={info.color} mono />
        <Chip label="Array size" value={`n = ${n?.toLocaleString()}`} color={info.color} mono />
        {timeMs != null && <Chip label="HVRP time" value={`${timeMs.toFixed(3)} ms`} color={info.color} mono />}
        {mergeTimeMs != null && <Chip label="Merge time" value={`${mergeTimeMs.toFixed(3)} ms`} color="var(--merge)" mono />}
        {speedup && <Chip label="Speedup" value={`${speedup}×`} color="var(--sorted)" mono />}
      </div>

      <p style={{ color: 'var(--text-dim)', fontSize: 13, lineHeight: 1.6, fontFamily: 'var(--font-mono)' }}>
        {info.why}
      </p>
    </div>
  );
}

function Chip({ label, value, color, mono }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ color: 'var(--text-muted)', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{
        color,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)',
        fontSize: 13,
        fontWeight: 700
      }}>
        {value}
      </span>
    </div>
  );
}