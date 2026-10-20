/**
 * Sound & Audio Service for Misi Mahir 3M
 * Provides rich Web Audio synthesized SFX and an adorable, kid-friendly BGM synthesizer loop.
 * Features:
 * - Multi-voice kid-friendly instruments: Sparkle Marimba, Celesta / Music Box, and Warm Acoustic Bass
 * - Low-pass filter to keep sound gentle, warm and pleasant (no harsh high frequencies)
 * - Calibrated low volume (so it doesn't disturb learning or speech synthesis)
 * - Master BGM volume control (adjustable between 0% and 100%)
 * - 3 cute background music tracks for children:
 *   1. "Ria Cilik 3M" (Playful Marimba & Bells)
 *   2. "Kotak Muzik Ajaib" (Gentle Music Box & Lullaby)
 *   3. "Pengembaraan Ceria" (Upbeat Island Adventure)
 * - Pure Web Audio API: Zero external audio file dependencies, 100% reliable offline!
 */

export interface BgmTrackOption {
  id: string;
  nameMs: string;
  nameEn: string;
  tempo: number; // BPM
  instrument: 'marimba' | 'musicbox' | 'adventure';
}

export const BGM_TRACKS: BgmTrackOption[] = [
  {
    id: 'ria_cilik',
    nameMs: 'Ria Cilik 3M 🎈',
    nameEn: 'Playful Kids 🎈',
    tempo: 122,
    instrument: 'marimba'
  },
  {
    id: 'kotak_muzik',
    nameMs: 'Kotak Muzik Ajaib ✨',
    nameEn: 'Magic Music Box ✨',
    tempo: 104,
    instrument: 'musicbox'
  },
  {
    id: 'pengembaraan',
    nameMs: 'Pulau Ceria 🏝️',
    nameEn: 'Sunny Island 🏝️',
    tempo: 128,
    instrument: 'adventure'
  }
];

class SoundService {
  private ctx: AudioContext | null = null;
  private bgmMasterGain: GainNode | null = null;
  private bgmFilter: BiquadFilterNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: any = null;
  private sfxEnabled: boolean = true;
  private bgmEnabled: boolean = false;
  private speechEnabled: boolean = true;
  private currentLanguage: 'ms' | 'en' = 'ms';
  
  // Volume setting: default 0.4 (40%), mapped to max gentle gain of 0.05 so it's always soft and not loud
  private bgmVolume: number = 0.4;
  private currentTrackId: string = 'ria_cilik';

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
    if (this.ctx && !this.bgmMasterGain) {
      this.bgmMasterGain = this.ctx.createGain();
      // Gentle warm low-pass filter to remove any harshness
      this.bgmFilter = this.ctx.createBiquadFilter();
      this.bgmFilter.type = 'lowpass';
      this.bgmFilter.frequency.value = 2200; // soft warm tone
      this.bgmFilter.Q.value = 1.0;

      this.bgmFilter.connect(this.bgmMasterGain);
      this.bgmMasterGain.connect(this.ctx.destination);
      this.updateBgmGain();
    }
  }

  private updateBgmGain() {
    if (this.bgmMasterGain && this.ctx) {
      // Maximum overall gain is capped at 0.055, ensuring it is NEVER too loud!
      const targetGain = this.bgmEnabled ? this.bgmVolume * 0.055 : 0;
      const now = this.ctx.currentTime;
      this.bgmMasterGain.gain.cancelScheduledValues(now);
      this.bgmMasterGain.gain.linearRampToValueAtTime(targetGain, now + 0.1);
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

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  public setBgmVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    this.updateBgmGain();
  }

  public getCurrentTrack(): string {
    return this.currentTrackId;
  }

  public setTrack(trackId: string) {
    this.currentTrackId = trackId;
    if (this.isBgmPlaying) {
      this.stopBgm();
      this.startBgm();
    }
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

  // ----------------------------------------------------
  // GENTLE KID-FRIENDLY BACKGROUND MUSIC (BGM) SYNTHESIZER
  // ----------------------------------------------------
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

  /**
   * Synthesize a gentle marimba/bell note with fundamental + warm harmonic
   */
  private playInstrumentNote(
    freq: number, 
    time: number, 
    duration: number, 
    vol: number = 0.4,
    instrument: 'marimba' | 'musicbox' | 'adventure' = 'marimba'
  ) {
    if (!this.ctx || !this.bgmFilter) return;

    try {
      // Oscillator 1: Fundamental
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();

      // Oscillator 2: Overtone chime
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();

      if (instrument === 'musicbox') {
        // Pure chime bell tone
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, time);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, time);
      } else if (instrument === 'adventure') {
        // Cheerful fluty tone
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, time);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 1.5, time);
      } else {
        // Marimba / Toy Piano
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, time);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 3, time); // 3rd harmonic woody ring
      }

      // Soft envelope (quick attack, gentle natural bell decay)
      const attack = 0.015;
      const decay = duration * 0.95;

      gain1.gain.setValueAtTime(0.001, time);
      gain1.gain.linearRampToValueAtTime(vol, time + attack);
      gain1.gain.exponentialRampToValueAtTime(0.0001, time + decay);

      gain2.gain.setValueAtTime(0.001, time);
      gain2.gain.linearRampToValueAtTime(vol * 0.25, time + attack);
      gain2.gain.exponentialRampToValueAtTime(0.0001, time + decay * 0.6);

      osc1.connect(gain1);
      osc2.connect(gain2);

      gain1.connect(this.bgmFilter);
      gain2.connect(this.bgmFilter);

      osc1.start(time);
      osc1.stop(time + decay);
      osc2.start(time);
      osc2.stop(time + decay);
    } catch {
      // ignore
    }
  }

  /**
   * Synthesize a subtle, warm acoustic bass note
   */
  private playBassNote(freq: number, time: number, duration: number, vol: number = 0.35) {
    if (!this.ctx || !this.bgmFilter) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle'; // Warm, soft round bass
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.9);

      osc.connect(gain);
      gain.connect(this.bgmFilter);

      osc.start(time);
      osc.stop(time + duration);
    } catch {
      // ignore
    }
  }

  public startBgm() {
    this.initContext();
    if (!this.ctx) return;
    if (this.isBgmPlaying) return;

    this.isBgmPlaying = true;
    this.bgmEnabled = true;
    this.updateBgmGain();

    // Note frequencies in Hz (C Major Scale for children)
    const C3 = 130.81, D3 = 146.83, E3 = 164.81, F3 = 174.61, G3 = 196.00, A3 = 220.00, B3 = 246.94;
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00, B5 = 987.77;
    const C6 = 1046.50, D6 = 1174.66, E6 = 1318.51;

    // Track 1: "Ria Cilik 3M" (Playful, bouncy Kindergarten Marimba)
    // 32-step loop (16 beats, 8 bars of 2/4 cheerful march)
    const track1Pattern = [
      // Bar 1 (C Major): C5 - E5 - G5 - E5 | Bass: C3
      { melody: C5, bass: C3, len: 0.24, chord: [E4, G4] },
      { melody: E5, bass: 0,  len: 0.24 },
      { melody: G5, bass: G3, len: 0.24 },
      { melody: E5, bass: 0,  len: 0.24 },

      // Bar 2 (G Major): D5 - G5 - B5 - G5 | Bass: G3
      { melody: D5, bass: G3, len: 0.24, chord: [D4, B4] },
      { melody: G5, bass: 0,  len: 0.24 },
      { melody: B5, bass: D3, len: 0.24 },
      { melody: G5, bass: 0,  len: 0.24 },

      // Bar 3 (A Minor): C5 - E5 - A5 - G5 | Bass: A3
      { melody: C5, bass: A3, len: 0.24, chord: [C4, E4] },
      { melody: E5, bass: 0,  len: 0.24 },
      { melody: A5, bass: E3, len: 0.24 },
      { melody: G5, bass: 0,  len: 0.24 },

      // Bar 4 (F Major): F5 - A5 - G5 - F5 | Bass: F3
      { melody: F5, bass: F3, len: 0.24, chord: [C4, F4] },
      { melody: A5, bass: 0,  len: 0.24 },
      { melody: G5, bass: C3, len: 0.24 },
      { melody: F5, bass: 0,  len: 0.24 },

      // Bar 5 (C Major - Sparkle Peak): E5 - G5 - C6 - G5 | Bass: C3
      { melody: E5, bass: C3, len: 0.24, chord: [G4, C5] },
      { melody: G5, bass: 0,  len: 0.24 },
      { melody: C6, bass: G3, len: 0.30 },
      { melody: G5, bass: 0,  len: 0.20 },

      // Bar 6 (D Minor): F5 - A5 - D6 - A5 | Bass: D3
      { melody: F5, bass: D3, len: 0.24, chord: [F4, A4] },
      { melody: A5, bass: 0,  len: 0.24 },
      { melody: D6, bass: A3, len: 0.28 },
      { melody: A5, bass: 0,  len: 0.20 },

      // Bar 7 (G Major): G5 - B5 - D6 - B5 | Bass: G3
      { melody: G5, bass: G3, len: 0.24, chord: [G4, D5] },
      { melody: B5, bass: 0,  len: 0.24 },
      { melody: D6, bass: D3, len: 0.24 },
      { melody: B5, bass: 0,  len: 0.24 },

      // Bar 8 (Resolve to C): C6 - G5 - E5 - C5 | Bass: C3
      { melody: C6, bass: C3, len: 0.32, chord: [E4, G4, C5] },
      { melody: G5, bass: 0,  len: 0.20 },
      { melody: E5, bass: G3, len: 0.22 },
      { melody: C5, bass: 0,  len: 0.22 },
    ];

    // Track 2: "Kotak Muzik Ajaib" (Gentle, dreamy Celesta Music Box)
    const track2Pattern = [
      { melody: G5, bass: C3, len: 0.32, chord: [C4, E4] },
      { melody: E5, bass: 0,  len: 0.28 },
      { melody: C5, bass: G3, len: 0.32 },
      { melody: E5, bass: 0,  len: 0.28 },

      { melody: A5, bass: F3, len: 0.32, chord: [C4, F4] },
      { melody: F5, bass: 0,  len: 0.28 },
      { melody: D5, bass: C3, len: 0.32 },
      { melody: F5, bass: 0,  len: 0.28 },

      { melody: G5, bass: G3, len: 0.32, chord: [B3, D4] },
      { melody: D5, bass: 0,  len: 0.28 },
      { melody: B4, bass: D3, len: 0.32 },
      { melody: D5, bass: 0,  len: 0.28 },

      { melody: C6, bass: C3, len: 0.40, chord: [C4, E4, G4] },
      { melody: G5, bass: 0,  len: 0.28 },
      { melody: E5, bass: G3, len: 0.30 },
      { melody: 0,  bass: 0,  len: 0.20 },
    ];

    // Track 3: "Pulau Ceria" (Upbeat Island Whistle & Ukulele Pluck)
    const track3Pattern = [
      { melody: C5, bass: C3, len: 0.22, chord: [E4, G4] },
      { melody: C5, bass: 0,  len: 0.22 },
      { melody: E5, bass: G3, len: 0.22 },
      { melody: G5, bass: 0,  len: 0.22 },

      { melody: A5, bass: A3, len: 0.25, chord: [C4, E4] },
      { melody: G5, bass: 0,  len: 0.22 },
      { melody: E5, bass: E3, len: 0.22 },
      { melody: D5, bass: 0,  len: 0.22 },

      { melody: F5, bass: F3, len: 0.25, chord: [A3, C4] },
      { melody: E5, bass: 0,  len: 0.22 },
      { melody: D5, bass: C3, len: 0.22 },
      { melody: C5, bass: 0,  len: 0.22 },

      { melody: D5, bass: G3, len: 0.25, chord: [B3, D4] },
      { melody: E5, bass: 0,  len: 0.22 },
      { melody: D5, bass: D3, len: 0.22 },
      { melody: G4, bass: 0,  len: 0.22 },
    ];

    let stepIndex = 0;

    const playLoopStep = () => {
      if (!this.isBgmPlaying || !this.ctx) return;

      // Select active pattern based on track ID
      let pattern = track1Pattern;
      let instType: 'marimba' | 'musicbox' | 'adventure' = 'marimba';

      if (this.currentTrackId === 'kotak_muzik') {
        pattern = track2Pattern;
        instType = 'musicbox';
      } else if (this.currentTrackId === 'pengembaraan') {
        pattern = track3Pattern;
        instType = 'adventure';
      }

      const item = pattern[stepIndex % pattern.length];
      stepIndex++;

      const now = this.ctx.currentTime;

      // 1. Play Lead Melody
      if (item.melody > 0) {
        this.playInstrumentNote(item.melody, now, item.len, 0.45, instType);
      }

      // 2. Play Gentle Bass
      if (item.bass > 0) {
        this.playBassNote(item.bass, now, item.len * 1.5, 0.35);
      }

      // 3. Play Soft Accompanying Chord Sparkle
      if (item.chord && item.chord.length > 0) {
        item.chord.forEach((chordFreq, idx) => {
          this.playInstrumentNote(chordFreq, now + idx * 0.02, item.len * 1.2, 0.18, instType);
        });
      }

      // Schedule next note smoothly
      this.bgmIntervalId = setTimeout(playLoopStep, item.len * 1000);
    };

    playLoopStep();
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
