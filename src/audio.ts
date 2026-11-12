// All sound is synthesised with the Web Audio API, so the prototype ships no audio files.

class Sound {
  private ctx?: AudioContext;
  private master?: GainNode;
  private filter?: BiquadFilterNode;
  private lastKey = 0;
  private tense = false;
  muted = false;

  start() {
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    this.master.connect(ctx.destination);

    // Room drone: two detuned low voices through a slowly breathing filter.
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150;
    filter.Q.value = 4;
    this.filter = filter;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.11;
    filter.connect(droneGain).connect(this.master);
    for (const [freq, type] of [
      [55, 'sawtooth'],
      [55.6, 'sawtooth'],
      [82.4, 'sine'],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      o.connect(filter);
      o.start();
    }
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 40;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    window.setInterval(() => this.beat(), 1000);
  }

  private noise(dur: number, freq: number, type: BiquadFilterType, gain: number, at = 0) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(f).connect(g).connect(this.master);
    src.start(ctx.currentTime + at);
  }

  private thump(at: number, gain: number, from = 70, to = 36, dur = 0.2) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const t = ctx.currentTime + at;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private beat() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    this.noise(0.012, 5200, 'highpass', 0.05); // wall clock
    if (this.tense) {
      this.thump(0, 0.5);
      this.thump(0.24, 0.35);
    }
  }

  /** Typewriter key. Throttled so fast text does not turn into a buzz. */
  key() {
    const now = performance.now();
    if (now - this.lastKey < 48) return;
    this.lastKey = now;
    this.noise(0.022, 2200 + Math.random() * 1800, 'bandpass', 0.09);
  }

  /** Teleprinter burst for scene cards. */
  telex() {
    for (let i = 0; i < 14; i++) this.noise(0.02, 3000 + Math.random() * 1500, 'bandpass', 0.08, i * 0.055);
  }

  /** Rubber stamp on the file. */
  stamp() {
    this.thump(0, 0.9, 110, 34, 0.32);
    this.noise(0.09, 900, 'lowpass', 0.5);
  }

  /** Low hit for endings and bad news. */
  hit() {
    this.thump(0, 0.9, 60, 28, 1.2);
  }

  setCover(days: number) {
    this.tense = days <= 7;
    if (this.filter && this.ctx) {
      const target = 150 + (14 - Math.min(14, Math.max(0, days))) * 28;
      this.filter.frequency.setTargetAtTime(target, this.ctx.currentTime, 1.5);
    }
  }

  toggle() {
    this.muted = !this.muted;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(this.muted ? 0 : 0.9, this.ctx.currentTime, 0.05);
    return this.muted;
  }
}

export const sound = new Sound();
