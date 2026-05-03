import React from 'react';

export default function Home({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.3,
          zIndex: 0
        }} />

        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '20%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)',
          zIndex: 0, pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '15%',
          width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(57,255,20,0.06) 0%, transparent 70%)',
          zIndex: 0, pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-block',
            border: '1px solid var(--hvrp)',
            borderRadius: 4,
            padding: '4px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--hvrp)',
            letterSpacing: 2,
            marginBottom: 32,
            animation: 'fadeIn 0.4s ease'
          }}>
            DAA LAB PROJECT — MSRIT
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 7vw, 80px)',
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1,
            marginBottom: 16,
            animation: 'fadeIn 0.5s ease 0.1s both'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, var(--hvrp) 0%, var(--parallel-color) 50%, var(--merge) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              HVRP
            </span>
            <br />
            <span style={{ color: 'var(--text)', fontSize: '60%' }}>Sort</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--text-muted)',
            letterSpacing: 2,
            marginBottom: 24,
            animation: 'fadeIn 0.5s ease 0.15s both'
          }}>
            HYBRID VECTORIZED RADIX PARALLEL MERGE SORT
          </p>

          <p style={{
            color: 'var(--text-dim)',
            fontSize: 16,
            lineHeight: 1.8,
            maxWidth: 600,
            margin: '0 auto 48px',
            animation: 'fadeIn 0.5s ease 0.2s both'
          }}>
            An adaptive sorting algorithm that dynamically selects between
            Radix Sort, AVX2-Vectorized Merge Sort, and OpenMP Parallel Merge Sort
            based on input size — outperforming each individual algorithm across all ranges.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeIn 0.5s ease 0.25s both' }}>
            <button
              onClick={() => onNavigate('visualizer')}
              style={{
                background: 'var(--hvrp)',
                color: '#000',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 14,
                padding: '14px 32px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: 1,
                boxShadow: '0 0 24px var(--hvrp-glow)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 0 40px var(--hvrp-glow)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 0 24px var(--hvrp-glow)'; }}
            >
              ▶ Launch Visualizer
            </button>
            <a
              href="#how-it-works"
              style={{
                background: 'transparent',
                color: 'var(--text)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 14,
                padding: '14px 32px',
                borderRadius: 6,
                border: '1px solid var(--border-bright)',
                cursor: 'pointer',
                letterSpacing: 1,
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              How It Works ↓
            </a>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 0
      }}>
        {[
          { label: 'Radix Sort threshold', value: 'n < 128', color: 'var(--radix-color)' },
          { label: 'AVX2 Vectorized threshold', value: '128 ≤ n ≤ 8192', color: 'var(--vectorized-color)' },
          { label: 'Parallel threshold', value: 'n > 8192', color: 'var(--parallel-color)' },
          { label: 'Implementation', value: 'C++ + JNI + Java', color: 'var(--merge)' },
        ].map(({ label, value, color }, i) => (
          <div key={i} style={{
            padding: '20px 40px',
            borderRight: i < 3 ? '1px solid var(--border)' : 'none',
            textAlign: 'center',
            minWidth: 180
          }}>
            <div style={{ color, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div id="how-it-works" style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
        <SectionHeader label="ALGORITHM" title="How HVRP Works" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 60 }}>
          <AlgoCard
            step="01"
            color="var(--radix-color)"
            title="Radix Sort"
            condition="n < 128"
            complexity="O(n·k)"
            desc="4-pass LSD radix sort operating byte-by-byte. The entire array fits in L1 cache, making radix sort's linear complexity unbeatable at this scale. No comparisons needed."
          />
          <AlgoCard
            step="02"
            color="var(--vectorized-color)"
            title="Vectorized Merge Sort (AVX2)"
            condition="128 ≤ n ≤ 8192"
            complexity="O(n log n)"
            desc="Uses __m256i SIMD registers to compare and merge 8 × int32 values simultaneously per CPU cycle. Exploits Intel AVX2 instruction-level parallelism for mid-range inputs."
          />
          <AlgoCard
            step="03"
            color="var(--parallel-color)"
            title="Parallel Merge Sort"
            condition="n > 8192"
            complexity="O(n log n / p)"
            desc="OpenMP spawns threads across all CPU cores. Each core recursively sorts a partition in parallel. Thread spawn overhead is negligible at this scale. Dominant for large datasets."
          />
        </div>

        <SectionHeader label="ARCHITECTURE" title="Implementation Stack" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 60 }}>
          <StackCard title="Native Layer (C++)" color="var(--hvrp)" items={[
            'AVX2 intrinsics: __m256i, _mm256_min_epi32',
            'OpenMP: #pragma omp parallel sections',
            'Custom LSD Radix Sort (4 passes, byte-based)',
            'Compiled with -O3 -mavx2 -fopenmp (MinGW-w64)',
            'Output: NativeSorter.dll'
          ]} />
          <StackCard title="Java Interface Layer" color="var(--merge)" items={[
            'JNI (Java Native Interface) bridges Java ↔ C++',
            'System.nanoTime() for precision timing',
            'SortRunner.java orchestrates all algorithms',
            'CSV output for performance logging',
            'Tested on AMD Ryzen 5 5600H, 16GB RAM'
          ]} />
        </div>

        <SectionHeader label="RESULTS" title="Performance Findings" />
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: 32,
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--text-dim)',
          lineHeight: 1.8
        }}>
          <p style={{ marginBottom: 12 }}>
            Experimental results show HVRP consistently achieves <span style={{ color: 'var(--hvrp)' }}>the lowest execution times</span> across
            all input sizes from 500 to 10,000,000 integers — outperforming Bubble Sort, Lazy Merge Sort,
            standard Merge Sort, Parallel Merge Sort, and Vectorized Merge Sort individually.
          </p>
          <p style={{ marginBottom: 12 }}>
            The algorithm achieves higher <span style={{ color: 'var(--parallel-color)' }}>speedup ratios</span> over standard Java Merge Sort as input size increases,
            with crossover points where HVRP begins outperforming each of its component algorithms occurring predictably at the threshold boundaries (128, 8192).
          </p>
          <p>
            Future directions include <span style={{ color: 'var(--merge)' }}>AVX-512 support</span> (wider 512-bit registers), GPU acceleration via CUDA/OpenCL,
            and ML-based adaptive threshold selection based on runtime input distribution analysis.
          </p>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <button
            onClick={() => onNavigate('visualizer')}
            style={{
              background: 'transparent',
              color: 'var(--hvrp)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 15,
              padding: '16px 40px',
              borderRadius: 6,
              border: '1px solid var(--hvrp)',
              cursor: 'pointer',
              letterSpacing: 1,
              boxShadow: '0 0 16px var(--hvrp-dim)',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={e => { e.target.style.background = 'var(--hvrp-dim)'; e.target.style.boxShadow = '0 0 32px var(--hvrp-glow)'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.boxShadow = '0 0 16px var(--hvrp-dim)'; }}
          >
            Open Visualizer →
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label, title }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: 3, marginBottom: 8 }}>{label}</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>{title}</h2>
    </div>
  );
}

function AlgoCard({ step, color, title, condition, complexity, desc }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${color}44`,
      borderRadius: 10,
      padding: 24,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: 16, right: 16,
        fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 800,
        color: `${color}15`, lineHeight: 1
      }}>{step}</div>
      <div style={{ color, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>{condition}</div>
      <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 4, color: 'var(--text)' }}>{title}</h3>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 16 }}>{complexity}</div>
      <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

function StackCard({ title, color, items }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: 24
    }}>
      <div style={{ color, fontWeight: 700, fontSize: 14, marginBottom: 16, fontFamily: 'var(--font-mono)' }}>{title}</div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color, flexShrink: 0 }}>→</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}