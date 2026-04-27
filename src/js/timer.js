export class Timer {
  constructor(onTick) {
    this.onTick = onTick;
    this.seconds = 0;
    this.handle = null;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.handle = setInterval(() => {
      this.seconds += 1;
      this.onTick(this.seconds);
    }, 1000);
  }

  stop() {
    if (this.handle) clearInterval(this.handle);
    this.handle = null;
    this.running = false;
  }

  reset() {
    this.stop();
    this.seconds = 0;
    this.onTick(this.seconds);
  }

  setSeconds(s) {
    this.seconds = s;
    this.onTick(this.seconds);
  }
}

export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
