const { radixSort } = require('./radixSort');
const { parallelMergeSort } = require('./parallelMergeSort');

// HVRP: Hybrid Vectorized Radix Parallel Merge Sort
// Mirrors the threshold logic from the paper exactly:
//   < 128       → Radix Sort
//   128 – 8192  → Vectorized Merge Sort (AVX2 simulated: processes 8 elements at a time)
//   > 8192      → Parallel Merge Sort
function hvrpSort(arr, options = {}) {
  const { recordSteps = true, maxRecordedSteps = 250 } = options;
  const n = arr.length;

  let strategy, subResult;

  if (n < 128) {
    strategy = 'radix';
    subResult = radixSort(arr, { recordSteps, maxRecordedSteps });
  } else if (n <= 8192) {
    strategy = 'vectorized';
    subResult = vectorizedMergeSort(arr, { recordSteps, maxRecordedSteps });
  } else {
    strategy = 'parallel';
    subResult = parallelMergeSort(arr, { recordSteps, maxRecordedSteps });
  }

  // Tag each step with the chosen strategy
  const taggedSteps = recordSteps ? subResult.steps.map(s => ({ ...s, strategy })) : [];

  return {
    steps: taggedSteps,
    sorted: subResult.sorted,
    strategy,
    thresholds: { radix: 128, vectorized: 8192 },
    n
  };
}

// Vectorized Merge Sort - simulates AVX2 by processing 8 elements per "vector" operation
// In real AVX2: loads 8 x 32-bit ints into __m256i, compares in parallel
// Here we batch comparisons 8 at a time to mirror that behavior
function vectorizedMergeSort(arr, options = {}) {
  const { recordSteps = true, maxRecordedSteps = 250 } = options;
  const VECTOR_WIDTH = 8; // AVX2 processes 8 x int32 per register
  const steps = recordSteps ? [] : null;
  const array = [...arr];

  const pushStep = (step) => {
    if (!recordSteps) return;
    if (steps.length < maxRecordedSteps - 1) {
      steps.push(step);
    }
  };

  function vectorizedMerge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    // Process VECTOR_WIDTH elements at a time (simulates _mm256_min_epi32 etc.)
    while (i + VECTOR_WIDTH <= leftArr.length && j + VECTOR_WIDTH <= rightArr.length) {
      // Simulate: load 8 from left, 8 from right, merge them
      const batch = [];
      let li = i, lj = j, batchCount = 0;
      while (batchCount < VECTOR_WIDTH && li < leftArr.length && lj < rightArr.length) {
        if (leftArr[li] <= rightArr[lj]) { batch.push(leftArr[li++]); }
        else { batch.push(rightArr[lj++]); }
        batchCount++;
      }
      for (const val of batch) { arr[k] = val; k++; }
      i = li; j = lj;

      if (recordSteps && Math.random() < 0.1) {
        pushStep({ type: 'vector_merge', indices: [left, k - 1], array: [...arr] });
      }
    }

    // Scalar fallback for remainder (mirrors AVX2 scalar tail handling)
    while (i < leftArr.length && j < rightArr.length) {
      arr[k] = leftArr[i] <= rightArr[j] ? leftArr[i++] : rightArr[j++];
      k++;
    }
    while (i < leftArr.length) { arr[k++] = leftArr[i++]; }
    while (j < rightArr.length) { arr[k++] = rightArr[j++]; }
  }

  function sort(arr, left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    sort(arr, left, mid);
    sort(arr, mid + 1, right);
    vectorizedMerge(arr, left, mid, right);
    if (recordSteps && Math.random() < 0.08) {
      pushStep({ type: 'merge', indices: [left, mid, right], array: [...arr] });
    }
  }

  sort(array, 0, array.length - 1);
  if (recordSteps) {
    const doneStep = { type: 'done', array: [...array] };
    if (steps.length >= maxRecordedSteps) {
      steps[maxRecordedSteps - 1] = doneStep;
    } else {
      steps.push(doneStep);
    }
  }
  return { steps: steps || [], sorted: array };
}

module.exports = { hvrpSort };