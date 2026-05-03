import React from 'react';

export default function Controls({
  arraySize, setArraySize,
  speed, setSpeed,
  onGenerate, onSort, onReset,
  isLoading, isPlaying, hasSorted
}) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '20px 24px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 24,
      alignItems: 'flex-end'
    }}>
      {/* Array size */}
      <SliderField
        label="Array Size"
        value={arraySize}
        min={10} max={5000} step={10}
        onChange={setArraySize}
        display={arraySize.toLocaleString()}
        color="var(--hvrp)"
      />

      {/* Speed */}
      <SliderField
        label="Animation Speed"
        value={speed}
        min={1} max={100} step={1}
        onChange={setSpeed}
        display={speed < 30 ? 'slow' : speed < 70 ? 'medium' : 'fast'}
        color="var(--merge)"
      />

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
        <Btn onClick={onGenerate} disabled={isLoading || isPlaying} variant="outline">
          Generate Array
        </Btn>
        <Btn onClick={onSort} disabled={isLoading || isPlaying} variant="primary">
          {isLoading ? 'Computing...' : '▶ Sort & Compare'}
        </Btn>
        {hasSorted && (
          <Btn onClick={onReset} disabled={isLoading || isPlaying} variant="ghost">
            Reset
          </Btn>
        )}
      </div>
    </div>
  );
}

function SliderField({ label, value, min, max, step, onChange, display, color }) {
  return (
    <div style={{ minWidth: 180 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 1 }}>
          {label}
        </span>
        <span style={{ fontSize: 12, color, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ '--thumb-color': color }}
      />
    </div>
  );
}

function Btn({ children, onClick, disabled, variant }) {
  const styles = {
    primary: {
      background: 'var(--hvrp)',
      color: '#000',
      fontWeight: 800,
      padding: '10px 20px',
      borderRadius: 6,
      fontSize: 13,
      transition: 'opacity 0.2s, box-shadow 0.2s',
      boxShadow: disabled ? 'none' : '0 0 16px var(--hvrp-glow)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text)',
      border: '1px solid var(--border-bright)',
      padding: '10px 20px',
      borderRadius: 6,
      fontSize: 13,
      transition: 'border-color 0.2s'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-dim)',
      padding: '10px 16px',
      borderRadius: 6,
      fontSize: 13
    }
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...styles[variant], opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {children}
    </button>
  );
}