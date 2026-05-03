// Parallel Merge Sort - simulates parallel execution via chunked processing
// JS is single-threaded, so we simulate parallelism by sorting chunks independently
// then merging, mirroring your OpenMP-based C++ implementation structure
function parallelMergeSort(arr, options = {}) {
  const { recordSteps = true, maxRecordedSteps = 250 } = options;
  const steps = recordSteps ? [] : null;
  const array = [...arr];
  const MAX_DEPTH = 4; // mirrors OpenMP thread depth limit

  const pushStep = (step) => {
    if (!recordSteps) return;
    if (steps.length < maxRecordedSteps - 1) {
      steps.push(step);
    }
  };

  function merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]; i++;
      } else {
        arr[k] = rightArr[j]; j++;
      }
      k++;
    }
    while (i < leftArr.length) { arr[k] = leftArr[i]; i++; k++; }
    while (j < rightArr.length) { arr[k] = rightArr[j]; j++; k++; }
  }

  function sort(arr, left, right, depth) {
    if (left >= right) return;

    // Base: use radix-like grouping for small partitions (< 128)
    if (right - left < 32) {
      // insertion sort as leaf (cache-friendly)
      for (let i = left + 1; i <= right; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= left && arr[j] > key) { arr[j + 1] = arr[j]; j--; }
        arr[j + 1] = key;
      }
      pushStep({ type: 'partition_sorted', indices: [left, right], array: [...arr] });
      return;
    }

    const mid = Math.floor((left + right) / 2);

    // Simulate parallel branches (depth controls thread spawning in real impl)
    sort(arr, left, mid, depth + 1);
    sort(arr, mid + 1, right, depth + 1);

    merge(arr, left, mid, right);

    // Sample steps every ~5% to avoid huge payloads
    if (recordSteps && (Math.random() < 0.05 || depth <= 2)) {
      pushStep({ type: 'merge', indices: [left, mid, right], array: [...arr] });
    }
  }

  sort(array, 0, array.length - 1, 0);
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

module.exports = { parallelMergeSort };