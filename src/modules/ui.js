const el = (id) => document.getElementById(id);

const $numTop = el('numTop');
const $numBottom = el('numBottom');
const $numTopNext = el('numTopNext');
const $numBottomNext = el('numBottomNext');
const $opSymbol = el('opSymbol');
const $opSymbolNext = el('opSymbolNext');
const $currentSlide = el('currentSlide');
const $nextSlide = el('nextSlide');
const $answerInput = el('answerInput');
const $submitBtn = el('submitBtn');
const $feedback = el('feedback');
const $revealBtn = el('revealBtn');
const $scoreEl = el('score');
const $streakEl = el('streak');
const $confettiContainer = el('confetti-container');

let currentProblem = null;
let nextProblem = null;

function renderToSlide(problem, topEl, bottomEl, opEl) {
  topEl.textContent = problem.topNum;
  bottomEl.textContent = problem.bottomNum;
  opEl.textContent = problem.operator;
}

export function showCurrentProblem(problem) {
  currentProblem = problem;
  renderToSlide(problem, $numTop, $numBottom, $opSymbol);
}

export function prepareNextProblem(problem) {
  nextProblem = problem;
  renderToSlide(problem, $numTopNext, $numBottomNext, $opSymbolNext);
}

export function slideToNext() {
  $currentSlide.style.transform = 'translateX(-120%)';
  $currentSlide.style.opacity = '0';

  $nextSlide.style.transform = 'translateX(120%)';
  $nextSlide.style.opacity = '1';
  void $nextSlide.offsetWidth;
  $nextSlide.style.transform = 'translateX(0%)';
  $nextSlide.style.opacity = '1';

  return new Promise((resolve) => {
    setTimeout(() => {
      $currentSlide.style.transition = 'none';
      $currentSlide.style.transform = 'translateX(0%)';
      $currentSlide.style.opacity = '1';
      renderToSlide(nextProblem, $numTop, $numBottom, $opSymbol);
      currentProblem = nextProblem;
      $nextSlide.style.transform = 'translateX(120%)';
      $nextSlide.style.opacity = '0';
      void $currentSlide.offsetWidth;
      $currentSlide.style.transition = '';
      resolve();
    }, 480);
  });
}

export function resetSlidePosition() {
  $currentSlide.style.transition = 'none';
  $currentSlide.style.transform = 'translateX(0%)';
  $currentSlide.style.opacity = '1';
  $nextSlide.style.transition = 'none';
  $nextSlide.style.transform = 'translateX(120%)';
  $nextSlide.style.opacity = '0';
  void $currentSlide.offsetWidth;
  $currentSlide.style.transition = '';
  $nextSlide.style.transition = '';
}

export function spawnConfetti() {
  const colors = [
    '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b',
    '#a29bfe', '#fd79a8', '#00cec9', '#fdcb6e', '#e056a0',
  ];
  const shapes = ['50%', '30%', '2px'];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.top = -(Math.random() * 40 + 10) + 'px';
    piece.style.width = Math.random() * 14 + 6 + 'px';
    piece.style.height = Math.random() * 14 + 6 + 'px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];
    piece.style.animationDelay = Math.random() * 0.6 + 's';
    piece.style.animationDuration = Math.random() * 1.8 + 1.5 + 's';
    fragment.appendChild(piece);
  }

  $confettiContainer.appendChild(fragment);
  setTimeout(() => {
    $confettiContainer.innerHTML = '';
  }, 3100);
}

export function showCorrect() {
  $feedback.className = 'feedback correct';
  $feedback.textContent = '🎉 CORRECT! 🎉';
  $feedback.style.animation = 'popIn 0.4s ease';
  setTimeout(() => {
    $feedback.style.animation = '';
  }, 400);
  $answerInput.classList.add('correct-flash');
  $answerInput.disabled = true;
  $submitBtn.disabled = true;
}

export function showWrong() {
  $feedback.className = 'feedback wrong';
  $feedback.innerHTML = '❌ WRONG<br>Try again, you can do it! 💪';
  $feedback.style.animation = 'popIn 0.4s ease';
  setTimeout(() => {
    $feedback.style.animation = '';
  }, 400);
  $answerInput.classList.add('wrong-shake');
  setTimeout(() => $answerInput.classList.remove('wrong-shake'), 500);
  setTimeout(() => {
    $answerInput.focus();
    $answerInput.select();
  }, 100);
}

export function clearFeedback() {
  $feedback.textContent = '';
  $feedback.className = 'feedback';
  $answerInput.classList.remove('correct-flash', 'wrong-shake');
}

export function setScoreUI(score, streak) {
  $scoreEl.textContent = score;
  $streakEl.textContent = streak;
}

export function resetRevealButton() {
  $revealBtn.textContent = '👀 Show Answer';
  $revealBtn.classList.remove('showing-answer');
}

export function setRevealButtonShowing(answer) {
  $revealBtn.textContent = `Answer: ${answer}`;
  $revealBtn.classList.add('showing-answer');
}

export function setAnswerInputValue(value) {
  $answerInput.value = value;
}

export function getAnswerInputValue() {
  return $answerInput.value.trim();
}

export function focusAnswerInput() {
  $answerInput.focus();
}

export function selectAnswerInput() {
  $answerInput.select();
}

export function enableInputs() {
  $answerInput.disabled = false;
  $submitBtn.disabled = false;
}

export function disableInputs() {
  $answerInput.disabled = true;
  $submitBtn.disabled = true;
}

export function isRevealButton(btn) {
  return btn === $revealBtn;
}

export function getSubmitBtn() {
  return $submitBtn;
}

export function getAnswerInput() {
  return $answerInput;
}

export function getRevealBtn() {
  return $revealBtn;
}

export function getCurrentProblem() {
  return currentProblem;
}
