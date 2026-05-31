let audioCtx = null;
let _soundEnabled = true;
let bgmNodes = [];
let bgmPlaying = false;

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.15, rampDown = false) {
  if (!_soundEnabled) return;
  const ctx = ensureAudio();
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(volume, t);
  if (rampDown) {
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  } else {
    gain.gain.setValueAtTime(0, t + duration);
  }
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

function playNoise(duration, volume = 0.06, highpass = 0) {
  if (!_soundEnabled) return;
  const ctx = ensureAudio();
  const t = ctx.currentTime;
  const bufSize = Math.ceil(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  if (highpass) {
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(highpass, t);
    src.connect(hp).connect(gain).connect(ctx.destination);
  } else {
    src.connect(gain).connect(ctx.destination);
  }
  src.start(t);
  src.stop(t + duration + 0.05);
}

export function sfxKeypress() {
  if (!_soundEnabled) return;
  const ctx = ensureAudio();
  const t = ctx.currentTime;
  const freq = 600 + Math.random() * 300;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.06, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.1);
}

export function sfxCorrect() {
  if (!_soundEnabled) return;
  const ctx = ensureAudio();
  const t = ctx.currentTime;
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t + i * 0.09);
    gain.gain.setValueAtTime(0.12, t + i * 0.09);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.09);
    osc.stop(t + i * 0.09 + 0.25);
  });
  const cheerFreqs = [400, 500, 600, 700, 800, 600];
  cheerFreqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t + 0.5 + i * 0.06);
    gain.gain.setValueAtTime(0.04, t + 0.5 + i * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5 + i * 0.06 + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + 0.5 + i * 0.06);
    osc.stop(t + 0.5 + i * 0.06 + 0.12);
  });
  try {
    if (window.speechSynthesis) {
      const utter = new SpeechSynthesisUtterance('Yay!');
      utter.volume = _soundEnabled ? 0.7 : 0;
      utter.rate = 1.2;
      utter.pitch = 1.6;
      const voices = speechSynthesis.getVoices();
      const femaleVoice =
        voices.find(
          (v) =>
            v.name.includes('Female') ||
            v.name.includes('Samantha') ||
            v.name.includes('Karen'),
        ) || voices[0];
      if (femaleVoice) utter.voice = femaleVoice;
      speechSynthesis.cancel();
      setTimeout(() => speechSynthesis.speak(utter), 300);
    }
  } catch (_) {}
}

export function sfxWrong() {
  if (!_soundEnabled) return;
  playTone(180, 0.3, 'square', 0.1, true);
  setTimeout(() => playTone(140, 0.35, 'square', 0.1, true), 200);
}

export function sfxConfetti() {
  if (!_soundEnabled) return;
  const ctx = ensureAudio();
  const t = ctx.currentTime;
  for (let i = 0; i < 12; i++) {
    const freq = 800 + Math.random() * 1600;
    const startT = t + Math.random() * 0.5;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startT);
    gain.gain.setValueAtTime(0.03, startT);
    gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start(startT);
    osc.stop(startT + 0.3);
  }
  playNoise(0.5, 0.04, 1500);
}

export function startBGM() {
  if (!_soundEnabled || bgmPlaying) return;
  const ctx = ensureAudio();
  bgmPlaying = true;
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.04;
  masterGain.connect(ctx.destination);
  bgmNodes = [masterGain];

  const melodyNotes = [
    'C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'D4', 'F4', 'A4', 'D5', 'A4', 'F4',
    'E4', 'G4', 'C5', 'E5', 'C5', 'G4', 'A4', 'C5', 'F4', 'A4', 'G4', 'E4',
  ];
  const noteMap = {
    C4: 262, E4: 330, G4: 392, C5: 523, D4: 294,
    F4: 349, A4: 440, D5: 587, E5: 659,
  };
  const noteLength = 0.32;

  function scheduleLoop() {
    if (!bgmPlaying || !_soundEnabled) {
      stopBGM();
      return;
    }
    const now = ctx.currentTime;
    melodyNotes.forEach((note, i) => {
      const osc = ctx.createOscillator();
      const gn = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = noteMap[note] || 392;
      gn.gain.setValueAtTime(0.06, now + i * noteLength);
      gn.gain.exponentialRampToValueAtTime(0.001, now + i * noteLength + noteLength * 0.9);
      osc.connect(gn).connect(masterGain);
      osc.start(now + i * noteLength);
      osc.stop(now + i * noteLength + noteLength);
      bgmNodes.push(osc, gn);
    });
    bgmNodes.push(setTimeout(scheduleLoop, melodyNotes.length * noteLength * 1000 - 200));
  }
  scheduleLoop();
}

export function stopBGM() {
  bgmPlaying = false;
  bgmNodes.forEach((n) => {
    try { if (typeof n.stop === 'function') n.stop(); } catch (_) {}
    try { if (n.disconnect) n.disconnect(); } catch (_) {}
    if (typeof n === 'number') clearTimeout(n);
  });
  bgmNodes = [];
}

export function isSoundEnabled() {
  return _soundEnabled;
}

export function setSoundEnabled(value) {
  _soundEnabled = value;
}

export function getAudioContext() {
  return ensureAudio();
}
