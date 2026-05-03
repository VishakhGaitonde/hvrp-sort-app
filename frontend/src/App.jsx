import React, { useState } from 'react';
import Home from './pages/Home';
import Visualizer from './pages/Visualizer';

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'visualizer'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 56
      }}>
        {/* Logo */}
        <button
          onClick={() => setPage('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 4,
            background: 'linear-gradient(135deg, var(--hvrp), var(--parallel-color))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#000', fontFamily: 'var(--font-mono)'
          }}>H</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--text)', letterSpacing: -0.5 }}>
            HVRP Sort
          </span>
        </button>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ id: 'home', label: 'Overview' }, { id: 'visualizer', label: 'Visualizer' }].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                background: page === id ? 'var(--hvrp-dim)' : 'transparent',
                border: page === id ? '1px solid var(--hvrp)' : '1px solid transparent',
                color: page === id ? 'var(--hvrp)' : 'var(--text-dim)',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13,
                padding: '6px 16px', borderRadius: 5, cursor: 'pointer',
                transition: 'all 0.2s', letterSpacing: 0.3
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>
          MSRIT · DAA Lab
        </div>
      </nav>

      {page === 'home' ? <Home onNavigate={setPage} /> : <Visualizer />}
    </div>
  );
}