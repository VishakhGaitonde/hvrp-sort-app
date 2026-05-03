// Standard Merge Sort - records every comparison and swap step for animation
function mergeSort(arr, options = {}) {
  const { recordSteps = true, maxRecordedSteps = 250 } = options;
  const steps = recordSteps ? [] : null;
  const array = [...arr];

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
      pushStep({ type: 'compare', indices: [left + i, mid + 1 + j], array: [...arr] });
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]; i++;
      } else {
        arr[k] = rightArr[j]; j++;
      }
      pushStep({ type: 'set', indices: [k], array: [...arr] });
      k++;
    }
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      pushStep({ type: 'set', indices: [k], array: [...arr] });
      i++; k++;
    }
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      pushStep({ type: 'set', indices: [k], array: [...arr] });
      j++; k++;
    }
  }

  function sort(arr, left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    sort(arr, left, mid);
    sort(arr, mid + 1, right);
    merge(arr, left, mid, right);
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

module.exports = { mergeSort };