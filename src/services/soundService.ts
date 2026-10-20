/**
 * Sound & Audio Service for Misi Mahir 3M
 * Provides rich Web Audio synthesized SFX and an adorable, kid-friendly BGM synthesizer loop.
 * Also integrates Web Speech API for reading phonics and words out loud in Malay and English!
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private bgmGainNode: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: any = null;
  private sfxEnabled: boolean = true;
  private bgmEnabled: boolean = false; // default false so it doesn't auto-blast until user interacts/toggles
  private speechEnabled: boolean = true;
  private currentLanguage: 'ms' | 'en' = 'ms';

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  public getSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public setSpeechEnabled(enabled: boolean) {
    this.speechEnabled = enabled;
  }

  public getSpeechEnabled(): boolean {
    return this.speechEnabled;
  }

  public setLanguage(lang: 'ms' | 'en') {
    this.currentLanguage = lang;
  }

  // Play simple soft pop
  public playPop() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // ignore
    }
  }

  // Play button click
  public playClick() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  // Success arpeggio: C5 - E5 - G5 - C6
  public playSuccess() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.09;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch {
      // ignore
    }
  }

  // Coin collect sound
  public playCoin() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.08);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);
    } catch {
      // ignore
    }
  }

  // Error "uh-oh" soft sound
  public playError() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  }

  // Badge celebration fanfare
  public playBadgeUnlocked() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 0.5);
      });
    } catch {
      // ignore
    }
  }

  // Background Music Synthesizer (Upbeat, gentle Marimba Game Theme)
  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      this.bgmEnabled = false;
      return false;
    } else {
      this.bgmEnabled = true;
      this.startBgm();
      return true;
    }
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public startBgm() {
    this.initContext();
    if (!this.ctx) return;
    if (this.isBgmPlaying) return;

    this.isBgmPlaying = true;
    this.bgmEnabled = true;

    // Cheerful pentatonic melody pattern: C - D - E - G - A
    const melody = [
      { note: 523.25, len: 0.25 }, // C5
      { note: 587.33, len: 0.25 }, // D5
      { note: 659.25, len: 0.25 }, // E5
      { note: 783.99, len: 0.35 }, // G5
      { note: 659.25, len: 0.25 }, // E5
      { note: 783.99, len: 0.25 }, // G5
      { note: 880.00, len: 0.45 }, // A5
      { note: 783.99, len: 0.25 }, // G5
      { note: 659.25, len: 0.25 }, // E5
      { note: 587.33, len: 0.25 }, // D5
      { note: 523.25, len: 0.50 }, // C5
      { note: 0,      len: 0.25 }, // pause
      { note: 659.25, len: 0.25 }, // E5
      { note: 783.99, len: 0.25 }, // G5
      { note: 1046.5, len: 0.45 }, // C6
      { note: 783.99, len: 0.35 }, // G5
    ];

    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.isBgmPlaying || !this.ctx) return;

      const current = melody[noteIndex % melody.length];
      noteIndex++;

      if (current.note > 0) {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const now = this.ctx.currentTime;

          // Marimba-like bell tone
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(current.note, now);

          // Gentle low volume so it doesn't disturb learning
          gain.gain.setValueAtTime(0.045, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + current.len * 0.9);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + current.len);
        } catch {
          // ignore
        }
      }

      this.bgmIntervalId = setTimeout(playNextNote, current.len * 1000);
    };

    playNextNote();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId) {
      clearTimeout(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  // Speech synthesis for phonics, letters, words and instructions
  public speak(text: string, forceLang?: 'ms' | 'en') {
    if (!this.speechEnabled) return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // stop any current speech

      const utterance = new SpeechSynthesisUtterance(text);
      const targetLang = forceLang || this.currentLanguage;

      utterance.lang = targetLang === 'ms' ? 'ms-MY' : 'en-US';
      utterance.rate = 0.88; // clear & slightly slower for children
      utterance.pitch = 1.15; // slightly higher friendly tone

      // Try finding an appropriate voice
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        if (targetLang === 'ms') {
          const msVoice = voices.find(v => v.lang.startsWith('ms') || v.lang.startsWith('id'));
          if (msVoice) utterance.voice = msVoice;
        } else {
          const enVoice = voices.find(v => v.lang.startsWith('en'));
          if (enVoice) utterance.voice = enVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis unsupported or failed
    }
  }
}

export const soundService = new SoundService();
