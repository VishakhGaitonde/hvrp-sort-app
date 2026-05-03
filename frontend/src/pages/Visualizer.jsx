import React, { useState, useCallback, useRef } from 'react';
import Controls from '../components/Controls';
import SortVisualizer from '../components/SortVisualizer';
import AlgorithmInfo from '../components/AlgorithmInfo';
import ComparisonChart from '../components/ComparsionChart';
import { sortArray } from '../api/sortApi';

function generateArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 9900) + 100);
}

export default function Visualizer() {
  const [arraySize, setArraySize] = useState(120);
  const [speed, setSpeed] = useState(50);
  const [array, setArray] = useState(() => generateArray(120));
  const [hvrpSteps, setHvrpSteps] = useState(null);
  const [mergeSteps, setMergeSteps] = useState(null);
  const [hvrpInfo, setHvrpInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingVisualizer, setPlayingVisualizer] = useState(null); // 'hvrp' | 'merge' | null
  const [error, setError] = useState(null);
  const [doneCount, setDoneCount] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);

  const handleGenerate = useCallback(() => {
    const arr = generateArray(arraySize);
    setArray(arr);
    setHvrpSteps(null);
    setMergeSteps(null);
    setHvrpInfo(null);
    setDoneCount(0);
    setCurrentResult(null);
    setError(null);
  }, [arraySize]);

  const handleSort = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDoneCount(0);
    try {
      const data = await sortArray(array, 'both');
      setHvrpSteps(data.results.hvrp.steps);
      setMergeSteps(data.results.merge.steps);
      setHvrpInfo({
        strategy: data.results.hvrp.strategy,
        n: data.results.hvrp.n,
        timeMs: data.results.hvrp.timeMs,
        mergeTimeMs: data.results.merge.timeMs
      });
      setCurrentResult({
        n: array.length,
        hvrpTime: data.results.hvrp.timeMs,
        mergeTime: data.results.merge.timeMs
      });
      setIsPlaying(true);
      setPlayingVisualizer('hvrp'); // Start with HVRP
      setDoneCount(0);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [array]);

  const handleReset = useCallback(() => {
    const arr = generateArray(arraySize);
    setArray(arr);
    setHvrpSteps(null);
    setMergeSteps(null);
    setHvrpInfo(null);
    setDoneCount(0);
    setIsPlaying(false);
    setPlayingVisualizer(null);
    setCurrentResult(null);
    setError(null);
  }, [arraySize]);

  const handleDone = useCallback(() => {
    if (playingVisualizer === 'hvrp') {
      // HVRP finished, start Merge sort
      setPlayingVisualizer('merge');
    } else if (playingVisualizer === 'merge') {
      // Both finished
      setIsPlaying(false);
      setPlayingVisualizer(null);
    }
  }, [playingVisualizer]);

  const hasSorted = hvrpSteps !== null;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ animation: 'fadeIn 0.6s ease' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 4vw, 36px)',
            fontWeight: 800,
            letterSpacing: -1,
            background: 'linear-gradient(135deg, var(--hvrp), var(--parallel-color))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            HVRP Sort
          </h1>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1 }}>
            HYBRID VECTORIZED RADIX PARALLEL MERGE SORT
          </span>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 6, fontFamily: 'var(--font-mono)', maxWidth: 700 }}>
          Dynamically selects Radix Sort, AVX2-Vectorized Merge Sort, or Parallel Merge Sort based on input size thresholds.
          Compare against standard Merge Sort in real time.
        </p>
      </div>

      {/* Controls */}
      <Controls
        arraySize={arraySize} setArraySize={setArraySize}
        speed={speed} setSpeed={setSpeed}
        onGenerate={handleGenerate}
        onSort={handleSort}
        onReset={handleReset}
        isLoading={isLoading}
        isPlaying={isPlaying}
        hasSorted={hasSorted}
      />

      {error && (
        <div style={{
          background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.4)',
          borderRadius: 6, padding: '12px 16px', color: '#ff6b6b',
          fontFamily: 'var(--font-mono)', fontSize: 12
        }}>
          Error: {error}
        </div>
      )}

      {/* Strategy info */}
      {hvrpInfo && (
        <AlgorithmInfo
          strategy={hvrpInfo.strategy}
          n={hvrpInfo.n}
          timeMs={hvrpInfo.timeMs}
          mergeTimeMs={hvrpInfo.mergeTimeMs}
        />
      )}

      {/* Dual visualizers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, overflow: 'hidden' }}>
          {!hvrpSteps ? (
            <PreviewBars array={array} color="var(--hvrp)" label="HVRP SORT" />
          ) : (
            <SortVisualizer
              steps={hvrpSteps}
              label="HVRP SORT"
              color="var(--hvrp)"
              isPlaying={isPlaying && playingVisualizer === 'hvrp'}
              speed={speed}
              onDone={handleDone}
            />
          )}
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, overflow: 'hidden' }}>
          {!mergeSteps ? (
            <PreviewBars array={array} color="var(--merge)" label="MERGE SORT" />
          ) : (
            <SortVisualizer
              steps={mergeSteps}
              label="MERGE SORT"
              color="var(--merge)"
              isPlaying={isPlaying && playingVisualizer === 'merge'}
              speed={speed}
              onDone={handleDone}
            />
          )}
        </div>
      </div>

      {/* Benchmark chart */}
      <ComparisonChart currentResult={currentResult} />

      {/* Thresholds explainer */}
      <ThresholdCard />
    </div>
  );
}

// Static preview of unsorted array before sort runs
function PreviewBars({ array, color, label }) {
  const max = Math.max(...array);
  return (
    <div>
      <div style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 13, color, fontWeight: 700, letterSpacing: 1 }}>
        {label}
      </div>
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
          gap: array.length > 500 ? 1 : array.length > 200 ? 2 : 3,
          width: 'max-content',
          minWidth: '100%',
          height: '100%'
        }}>
          {array.slice(0, 300).map((val, i) => (
            <div key={i} style={{
              width: array.length > 1000 ? 2 : array.length > 500 ? 3 : 4,
              flexShrink: 0,
              height: `${(val / max) * 95}%`,
              background: '#2a2a45',
              borderRadius: '1px 1px 0 0'
            }} />
          ))}
        </div>
      </div>
      <p style={{ textAlign: 'center', marginTop: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        Press "Sort & Compare" to animate
      </p>
    </div>
  );
}

function ThresholdCard() {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '24px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    }}>
      {[
        {
          range: 'n < 128',
          algo: 'Radix Sort',
          color: 'var(--radix-color)',
          detail: '4-pass LSD radix sort. O(n·k) linear time. Optimal for small arrays that fit entirely in L1 cache.',
          complexity: 'O(nk)'
        },
        {
          range: '128 ≤ n ≤ 8192',
          algo: 'Vectorized Merge Sort (AVX2)',
          color: 'var(--vectorized-color)',
          detail: 'Uses __m256i SIMD registers to compare 8 integers simultaneously. Exploits instruction-level parallelism.',
          complexity: 'O(n log n)'
        },
        {
          range: 'n > 8192',
          algo: 'Parallel Merge Sort',
          color: 'var(--parallel-color)',
          detail: 'OpenMP divides recursion across CPU cores. Thread spawn overhead is justified at this scale.',
          complexity: 'O(n log n / p)'
        }
      ].map(({ range, algo, color, detail, complexity }) => (
        <div key={range} style={{
          borderLeft: `2px solid ${color}`,
          paddingLeft: 16
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{range}</div>
          <div style={{ color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{algo}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>{complexity}</div>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6 }}>{detail}</p>
        </div>
      ))}
    </div>
  );
}