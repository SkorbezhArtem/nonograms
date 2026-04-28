// Tiny synth based on WebAudio: no asset files needed.
// Each event has its own short tone.

let ctx = null;
let muted = false;

function ensureCtx() {
  if (!ctx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (Ctor) ctx = new Ctor();
  }
  return ctx;
}

function tone(freq, duration, type = 'sine', gain = 0.08) {
  if (muted) return;
  const c = ensureCtx();
  if (!c) return;
  if (c.state === 'suspended') c.resume();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = 0;
  osc.connect(g);
  g.connect(c.destination);
  const t = c.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

export const Sounds = {
  setMuted(v) {
    muted = Boolean(v);
  },
  isMuted() {
    return muted;
  },
  fill() {
    tone(420, 0.08, 'square', 0.06);
  },
  cross() {
    tone(260, 0.08, 'triangle', 0.06);
  },
  empty() {
    tone(180, 0.08, 'sine', 0.05);
  },
  win() {
    // small arpeggio
    tone(523.25, 0.18, 'sine', 0.09);
    setTimeout(() => tone(659.25, 0.18, 'sine', 0.09), 140);
    setTimeout(() => tone(783.99, 0.28, 'sine', 0.09), 280);
  },
};
