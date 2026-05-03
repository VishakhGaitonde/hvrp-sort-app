const express = require('express');
const router = express.Router();
const { mergeSort } = require('../algorithms/mergeSort');
const { hvrpSort } = require('../algorithms/hvrpSort');

// POST /api/sort
// Body: { array: number[], algorithm: 'hvrp' | 'merge' | 'both' }
// Returns: steps for animation + timing comparison
router.post('/', (req, res) => {
  try {
    const { array, algorithm = 'both' } = req.body;

    if (!Array.isArray(array) || array.length === 0) {
      return res.status(400).json({ error: 'array must be a non-empty array of numbers' });
    }
    // Hard cap for animation — beyond 5000 the step arrays get huge
    if (array.length > 5000) {
      return res.status(400).json({ error: 'Max array size for animation is 5,000. Use the benchmark chart for larger sizes.' });
    }

    const MAX_STEPS = 250; // max animation frames sent to client

    const thinSteps = (steps) => {
      if (!steps || steps.length === 0) return [];
      if (steps.length <= MAX_STEPS) return steps;
      const ratio = Math.ceil(steps.length / MAX_STEPS);
      const thinned = steps.filter((_, i) => i % ratio === 0);
      // Always include the last (done) step
      const last = steps[steps.length - 1];
      if (thinned[thinned.length - 1] !== last) thinned.push(last);
      return thinned;
    };

    const results = {};

    if (algorithm === 'hvrp' || algorithm === 'both') {
      const t0 = process.hrtime.bigint();
      const hvrpResult = hvrpSort([...array]);
      const t1 = process.hrtime.bigint();
      results.hvrp = {
        steps: thinSteps(hvrpResult.steps),
        sorted: hvrpResult.sorted,
        strategy: hvrpResult.strategy,
        thresholds: hvrpResult.thresholds,
        n: hvrpResult.n,
        timeMs: Number(t1 - t0) / 1_000_000
      };
    }

    if (algorithm === 'merge' || algorithm === 'both') {
      const t0 = process.hrtime.bigint();
      const mergeResult = mergeSort([...array]);
      const t1 = process.hrtime.bigint();
      results.merge = {
        steps: thinSteps(mergeResult.steps),
        sorted: mergeResult.sorted,
        timeMs: Number(t1 - t0) / 1_000_000
      };
    }

    res.json({ success: true, arraySize: array.length, results });
  } catch (err) {
    console.error('Sort error:', err);
    res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});

// GET /api/sort/benchmark - timing-only benchmark (no step recording = no memory spike)
router.get('/benchmark', (req, res) => {
  try {
    const sizes = [50, 128, 500, 1000, 2000, 5000, 8192];
    const benchmarks = [];

    for (const size of sizes) {
      const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 100000));

      // HVRP timing - strip steps immediately after to free memory
      const t0h = process.hrtime.bigint();
      const hvrpResult = hvrpSort([...arr], { recordSteps: false });
      const t1h = process.hrtime.bigint();

      // Merge timing - same
      const t0m = process.hrtime.bigint();
      const mergeResult = mergeSort([...arr], { recordSteps: false });
      const t1m = process.hrtime.bigint();

      benchmarks.push({
        size,
        hvrpMs: Number(t1h - t0h) / 1_000_000,
        mergeMs: Number(t1m - t0m) / 1_000_000
      });
    }

    res.json({ success: true, benchmarks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;