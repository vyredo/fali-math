const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function randomNum(digits) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return digits === 1 ? rand(1, 9) : rand(min, max);
}

function pickDigits(mode) {
  if (mode === 'single') return 1;
  if (mode === 'double') return 2;
  if (mode === 'triple') return 3;
  const r = Math.random();
  if (r < 0.25) return 1;
  if (r < 0.65) return 2;
  return 3;
}

export function generateProblem(config, mode) {
  let d1, d2, chosenMode;

  if (config) {
    d1 = config.topDigits;
    d2 = config.bottomDigits;
    chosenMode = config.type;
  } else if (mode === 'mixed') {
    d1 = pickDigits('mixed');
    d2 = pickDigits('mixed');
    chosenMode = Math.random() < 0.5 ? 'add' : 'sub';
  } else {
    d1 = pickDigits('mixed');
    d2 = pickDigits('mixed');
    chosenMode = mode === 'sub' ? 'sub' : 'add';
  }

  let rawNum1 = randomNum(d1);
  let rawNum2 = randomNum(d2);

  if (chosenMode === 'sub' && rawNum1 <= rawNum2) {
    let attempts = 0;
    while (rawNum1 <= rawNum2 && attempts < 100) {
      rawNum1 = randomNum(d1);
      rawNum2 = randomNum(d2);
      attempts++;
    }
    if (rawNum1 <= rawNum2) {
      const t = rawNum1;
      rawNum1 = rawNum2;
      rawNum2 = t;
    }
  }

  const topNum = rawNum1;
  const bottomNum = rawNum2;
  const answer = chosenMode === 'sub' ? topNum - bottomNum : topNum + bottomNum;

  return {
    topNum,
    bottomNum,
    operator: chosenMode === 'sub' ? '−' : '+',
    answer,
  };
}
