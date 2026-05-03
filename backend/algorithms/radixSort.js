// Radix Sort - LSD radix sort on 4 passes (byte-by-byte) matching your C++ implementation
function radixSort(arr, options = {}) {
  const { recordSteps = true, maxRecordedSteps = 250 } = options;
  const steps = recordSteps ? [] : null;
  const array = [...arr];
  const n = array.length;

  const pushStep = (step) => {
    if (!recordSteps) return;
    if (steps.length < maxRecordedSteps - 1) {
      steps.push(step);
    }
  };

  function getMax(arr) {
    return Math.max(...arr);
  }

  function countSort(arr, exp) {
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
    }

    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }

    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
      if (recordSteps && i % Math.max(1, Math.floor(n / 20)) === 0) {
        pushStep({ type: 'set', indices: [i], array: [...arr] });
      }
    }
    if (recordSteps) {
      pushStep({ type: 'pass', array: [...arr] });
    }
  }

  const max = getMax(array);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countSort(array, exp);
  }

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

module.exports = { radixSort };