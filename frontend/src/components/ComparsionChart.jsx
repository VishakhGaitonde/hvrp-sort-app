import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine, BarChart, Bar
} from 'recharts';
import { getBenchmark } from '../api/sortApi';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg3)',
      border: '1px solid var(--border-bright)',
      borderRadius: 6,
      padding: '10px 14px',
      fontFamily: 'var(--font-mono)',
      fontSize: 12
    }}>
      <p style={{ color: 'var(--text-dim)', marginBottom: 6 }}>n = {Number(label).toLocaleString()}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value.toFixed(3)} ms
        </p>
      ))}
    </div>
  );
};

export default function ComparisonChart({ currentResult }) {
  const [benchData, setBenchData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getBenchmark()
      .then(data => setBenchData(data.benchmarks || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Add current result to chart data as a highlight
  const chartData = benchData.map(d => ({
    size: d.size,
    HVRP: parseFloat(d.hvrpMs.toFixed(4)),
    'Merge Sort': parseFloat(d.mergeMs.toFixed(4))
  }));

  if (currentResult) {
    const exists = chartData.find(d => d.size === currentResult.n);
    if (!exists) {
      chartData.push({
        size: currentResult.n,
        HVRP: parseFloat((currentResult.hvrpTime || 0).toFixed(4)),
        'Merge Sort': parseFloat((currentResult.mergeTime || 0).toFixed(4)),
        current: true
      });
      chartData.sort((a, b) => a.size - b.size);
    }
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '24px',
      animation: 'fadeIn 0.5s ease'
    }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, color: 'var(--text)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
          Performance Benchmark
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
          HVRP vs Standard Merge Sort — execution time across array sizes
        </p>
      </div>

      {loading ? (
        <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          Loading benchmark data...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="size"
              stroke="var(--text-muted)"
              tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-muted)' }}
              tickFormatter={v => v >= 1000 ? `${v/1000}k` : v}
            />
            <YAxis
              stroke="var(--text-muted)"
              tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-muted)' }}
              tickFormatter={v => `${v}ms`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}
            />
            <Line
              type="monotone" dataKey="HVRP"
              stroke="var(--hvrp)" strokeWidth={2}
              dot={{ r: 3, fill: 'var(--hvrp)' }}
              activeDot={{ r: 5, boxShadow: '0 0 8px var(--hvrp-glow)' }}
            />
            <Line
              type="monotone" dataKey="Merge Sort"
              stroke="var(--merge)" strokeWidth={2}
              dot={{ r: 3, fill: 'var(--merge)' }}
              strokeDasharray="4 2"
            />
            {/* Threshold markers */}
            <ReferenceLine x={128} stroke="var(--radix-color)" strokeDasharray="3 3" label={{ value: '128', fill: 'var(--radix-color)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
            <ReferenceLine x={8192} stroke="var(--vectorized-color)" strokeDasharray="3 3" label={{ value: '8192', fill: 'var(--vectorized-color)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Threshold legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
        {[
          { color: 'var(--radix-color)', label: '< 128 → Radix Sort' },
          { color: 'var(--vectorized-color)', label: '128–8192 → Vectorized (AVX2)' },
          { color: 'var(--parallel-color)', label: '> 8192 → Parallel Merge Sort' }
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 2, background: color, borderRadius: 1 }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}