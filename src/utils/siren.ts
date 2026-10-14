// Synthesizer using standard Web Audio API - 100% self-contained and browser-native

class SoundController {
  private audioCtx: AudioContext | null = null;
  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenInterval: any = null;
  private isSirenActive = false;

  private ringtoneInterval: any = null;
  private isRingtoneActive = false;

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // High-volume modulated emergency siren
  public startSiren(): void {
    if (this.isSirenActive) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      this.sirenOsc = osc;
      this.sirenGain = gain;
      this.isSirenActive = true;

      // Frequency modulation loop (European / Police emergency pitch sweep)
      let goingUp = true;
      const sweep = () => {
        if (!this.isSirenActive || !this.sirenOsc) return;
        const now = ctx.currentTime;
        if (goingUp) {
          this.sirenOsc.frequency.linearRampToValueAtTime(1300, now + 0.6);
        } else {
          this.sirenOsc.frequency.linearRampToValueAtTime(700, now + 0.6);
        }
        goingUp = !goingUp;
      };

      sweep();
      this.sirenInterval = setInterval(sweep, 600);
    } catch (e) {
      console.warn('AudioContext error:', e);
    }
  }

  public stopSiren(): void {
    if (!this.isSirenActive) return;
    try {
      if (this.sirenInterval) {
        clearInterval(this.sirenInterval);
        this.sirenInterval = null;
      }
      if (this.sirenOsc && this.sirenGain && this.audioCtx) {
        this.sirenGain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);
        setTimeout(() => {
          try {
            this.sirenOsc?.stop();
            this.sirenOsc?.disconnect();
            this.sirenGain?.disconnect();
          } catch {}
          this.sirenOsc = null;
          this.sirenGain = null;
        }, 120);
      }
    } catch (e) {
      console.warn('Error stopping siren', e);
    } finally {
      this.isSirenActive = false;
    }
  }

  public isSirenRunning(): boolean {
    return this.isSirenActive;
  }

  // Short warning beep for countdown ticks
  public playCountdownTick(): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  // Pleasant success chime
  public playSafeChime(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, now + 0.18); // E5
      gain2.gain.setValueAtTime(0.2, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.65);
    } catch {}
  }

  // Dual-tone realistic telephone ring for fake call
  public startPhoneRingtone(): void {
    if (this.isRingtoneActive) return;
    this.isRingtoneActive = true;
    const playBurst = () => {
      if (!this.isRingtoneActive) return;
      try {
        const ctx = this.getContext();
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(480, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.setValueAtTime(0.15, now + 1.8);
        gain.gain.linearRampToValueAtTime(0.001, now + 1.9);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.9);
        osc2.stop(now + 1.9);
      } catch {}
    };

    playBurst();
    this.ringtoneInterval = setInterval(() => {
      if (!this.isRingtoneActive) return;
      playBurst();
    }, 3800);
  }

  public stopPhoneRingtone(): void {
    this.isRingtoneActive = false;
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }

  // Dual-Tone Multi-Frequency (DTMF) dialpad beep
  public playDtmfTone(key: string): void {
    const dtmfFrequencies: { [k: string]: [number, number] } = {
      '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
      '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
      '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
      '*': [941, 1209], '0': [941, 1336], '#': [941, 1477],
    };

    const freqs = dtmfFrequencies[key] || [800, 1300];
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.setValueAtTime(freqs[0], now);
      osc2.frequency.setValueAtTime(freqs[1], now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.15);
      osc2.stop(now + 0.15);
    } catch {}
  }
}

export const sound = new SoundController();
