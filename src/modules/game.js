import { generateProblem } from './problem.js';
import {
  sfxKeypress, sfxCorrect, sfxWrong, sfxConfetti, startBGM, stopBGM,
  isSoundEnabled, setSoundEnabled,
} from './audio.js';

let score = 0;
let streak = 0;
let correctAnswer = 0;
let answerRevealed = false;
let transitioning = false;
let mode = 'add';
let config = null;

function resetState() {
  score = 0;
  streak = 0;
  answerRevealed = false;
  transitioning = false;
}

export function init() {
  resetState();
  return { mode, config, score, streak };
}

export function getCorrectAnswer() {
  return correctAnswer;
}

export function isAnswerRevealed() {
  return answerRevealed;
}

export function isTransitioning() {
  return transitioning;
}

export function getMode() {
  return mode;
}

export function getConfig() {
  return config;
}

export function getScore() {
  return score;
}

export function getStreak() {
  return streak;
}

export function newProblem() {
  const problem = generateProblem(config, mode);
  correctAnswer = problem.answer;
  answerRevealed = false;
  return problem;
}

export function setModeInput(newMode) {
  if (newMode === mode && transitioning === false && !config) return null;
  mode = newMode;
  config = null;
  resetState();
  return newProblem();
}

export function applyConfig(cfg) {
  config = cfg;
  resetState();
  return newProblem();
}

export function resetConfig() {
  config = null;
  mode = 'add';
  resetState();
  return newProblem();
}

export function checkAnswer(userAnswer) {
  if (userAnswer === correctAnswer) {
    score++;
    streak++;
    answerRevealed = false;
    sfxCorrect();
    sfxConfetti();
    return { correct: true, score, streak, answer: correctAnswer };
  }
  streak = 0;
  sfxWrong();
  return { correct: false, score, streak, answer: correctAnswer };
}

export function advanceToNext() {
  transitioning = true;
  const problem = newProblem();
  return problem;
}

export function revealAnswer() {
  if (answerRevealed) {
    answerRevealed = false;
    return { revealed: false, answer: correctAnswer };
  }
  answerRevealed = true;
  return { revealed: true, answer: correctAnswer };
}

export function finishTransition() {
  transitioning = false;
}

export function toggleSound() {
  const enabled = !isSoundEnabled();
  setSoundEnabled(enabled);
  if (!enabled) {
    stopBGM();
  } else {
    startBGM();
  }
  return enabled;
}

export function ensureBGM() {
  if (isSoundEnabled()) startBGM();
}

export function handleKeypress(e) {
  const isDigit = e.key.length === 1 && /\d/.test(e.key);
  if (isDigit) sfxKeypress();
}
