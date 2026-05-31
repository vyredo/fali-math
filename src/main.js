import {
  showCurrentProblem, prepareNextProblem, slideToNext, resetSlidePosition,
  spawnConfetti, showCorrect, showWrong, clearFeedback,
  setScoreUI, resetRevealButton, setRevealButtonShowing,
  setAnswerInputValue, getAnswerInputValue, focusAnswerInput, selectAnswerInput,
  enableInputs,
  getSubmitBtn, getAnswerInput, getRevealBtn,
} from './modules/ui.js';
import {
  init as initGame, newProblem, checkAnswer, advanceToNext, revealAnswer,
  setModeInput, applyConfig, resetConfig, toggleSound,
  ensureBGM, handleKeypress, finishTransition,
  isTransitioning, isAnswerRevealed,
} from './modules/game.js';
import { getAudioContext } from './modules/audio.js';

const $submitBtn = getSubmitBtn();
const $answerInput = getAnswerInput();
const $revealBtn = getRevealBtn();

const $soundToggle = document.getElementById('soundToggle');
const $configGear = document.getElementById('configGear');
const $configPanel = document.getElementById('configPanel');
const $cfgTopDigits = document.getElementById('cfgTopDigits');
const $cfgBottomDigits = document.getElementById('cfgBottomDigits');
const $cfgType = document.getElementById('cfgType');
const $cfgApply = document.getElementById('cfgApply');
const $cfgReset = document.getElementById('cfgReset');
const $modeBtns = document.querySelectorAll('.mode-btn');

let configOpen = false;

function showProblem(p) {
  showCurrentProblem(p);
  resetRevealButton();
  clearFeedback();
  setAnswerInputValue('');
  enableInputs();
  focusAnswerInput();
}

function handleSubmit() {
  if (isTransitioning()) return;
  if (isAnswerRevealed()) {
    handleReveal();
    return;
  }

  const raw = getAnswerInputValue();
  if (raw === '') {
    focusAnswerInput();
    return;
  }

  const userAnswer = parseInt(raw, 10);
  if (isNaN(userAnswer)) {
    focusAnswerInput();
    selectAnswerInput();
    return;
  }

  const result = checkAnswer(userAnswer);
  setScoreUI(result.score, result.streak);

  if (result.correct) {
    showCorrect();
    spawnConfetti();
    const nextP = advanceToNext();
    prepareNextProblem(nextP);
    setTimeout(async () => {
      await slideToNext();
      finishTransition();
      clearFeedback();
      enableInputs();
      focusAnswerInput();
    }, 2200);
  } else {
    showWrong();
  }
}

function handleReveal() {
  const result = revealAnswer();
  if (result.revealed) {
    setRevealButtonShowing(result.answer);
    setAnswerInputValue(result.answer);
  } else {
    resetRevealButton();
    setAnswerInputValue('');
    focusAnswerInput();
  }
}

function handleSoundToggle() {
  getAudioContext();
  const enabled = toggleSound();
  $soundToggle.textContent = enabled ? '🔊' : '🔇';
  $soundToggle.classList.toggle('muted', !enabled);
}

function toggleConfigPanel() {
  configOpen = !configOpen;
  $configGear.classList.toggle('open', configOpen);
  $configPanel.classList.toggle('open', configOpen);
}

function handleApplyConfig() {
  const cfg = {
    topDigits: parseInt($cfgTopDigits.value, 10),
    bottomDigits: parseInt($cfgBottomDigits.value, 10),
    type: $cfgType.value,
  };
  configOpen = false;
  $configGear.classList.remove('open');
  $configPanel.classList.remove('open');
  $modeBtns.forEach((b) => b.classList.remove('active', 'add', 'sub', 'mixed'));
  setScoreUI(0, 0);
  const p = applyConfig(cfg);
  resetSlidePosition();
  showProblem(p);
}

function handleResetConfig() {
  configOpen = false;
  $configGear.classList.remove('open');
  $configPanel.classList.remove('open');
  $cfgTopDigits.value = '1';
  $cfgBottomDigits.value = '1';
  $cfgType.value = 'add';
  const p = resetConfig();
  const addBtn = document.querySelector('.mode-btn[data-mode="add"]');
  if (addBtn) addBtn.classList.add('active', 'add');
  setScoreUI(0, 0);
  resetSlidePosition();
  showProblem(p);
}

function handleModeSwitch(mode) {
  $modeBtns.forEach((b) => b.classList.remove('active', 'add', 'sub', 'mixed'));
  const activeBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
  if (activeBtn) activeBtn.classList.add('active', mode);
  const p = setModeInput(mode);
  if (p) {
    setScoreUI(0, 0);
    resetSlidePosition();
    showProblem(p);
  }
}

$submitBtn.addEventListener('click', handleSubmit);
$answerInput.addEventListener('keydown', (e) => {
  handleKeypress(e);
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSubmit();
  }
});
$revealBtn.addEventListener('click', handleReveal);
$soundToggle.addEventListener('click', handleSoundToggle);
$configGear.addEventListener('click', toggleConfigPanel);
$cfgApply.addEventListener('click', (e) => { e.preventDefault(); handleApplyConfig(); });
$cfgReset.addEventListener('click', (e) => { e.preventDefault(); handleResetConfig(); });
$modeBtns.forEach((btn) => {
  btn.addEventListener('click', () => handleModeSwitch(btn.dataset.mode));
});

document.addEventListener('click', () => ensureBGM(), { once: false });

document.addEventListener('DOMContentLoaded', () => {
  initGame();
  const p = newProblem();
  showCurrentProblem(p);
  resetSlidePosition();
  focusAnswerInput();
});
