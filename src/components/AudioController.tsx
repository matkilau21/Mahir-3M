import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Sparkles, 
  Sliders, 
  X, 
  Play, 
  Pause,
  Headphones
} from 'lucide-react';
import { Language } from '../types';
import { soundService, BGM_TRACKS } from '../services/soundService';

interface AudioControllerProps {
  lang: Language;
}

export const AudioController: React.FC<AudioControllerProps> = ({ lang }) => {
  const [isPlaying, setIsPlaying] = useState(soundService.getIsBgmPlaying());
  const [volume, setVolume] = useState(soundService.getBgmVolume()); // 0.0 to 1.0
  const [currentTrack, setCurrentTrack] = useState(soundService.getCurrentTrack());
  const [isOpen, setIsOpen] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(soundService.getSfxEnabled());
  const [speechEnabled, setSpeechEnabled] = useState(soundService.getSpeechEnabled());
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTogglePlay = () => {
    const active = soundService.toggleBgm();
    setIsPlaying(active);
    if (active) soundService.playPop();
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    soundService.setBgmVolume(newVal);
  };

  const handleSelectTrack = (trackId: string) => {
    soundService.playPop();
    setCurrentTrack(trackId);
    soundService.setTrack(trackId);
    if (!isPlaying) {
      const active = soundService.toggleBgm();
      setIsPlaying(active);
    }
  };

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    soundService.setSfxEnabled(next);
    if (next) soundService.playSuccess();
  };

  const handleToggleSpeech = () => {
    const next = !speechEnabled;
    setSpeechEnabled(next);
    soundService.setSpeechEnabled(next);
    if (next) {
      soundService.speak(lang === 'ms' ? 'Suara cikgu diaktifkan!' : 'Teacher voice enabled!', lang);
    }
  };

  const activeTrackObj = BGM_TRACKS.find(t => t.id === currentTrack) || BGM_TRACKS[0];

  return (
    <div className="relative" ref={popoverRef}>
      {/* Quick Play/Settings Pill */}
      <div className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100/80 p-1 rounded-2xl border border-amber-200 transition-all shadow-xs">
        {/* Play / Pause Toggle Button */}
        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black transition-all active:scale-95 ${
            isPlaying 
              ? 'bg-amber-400 text-amber-950 shadow-xs' 
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
          title={isPlaying ? (lang === 'ms' ? 'Hentikan Muzik' : 'Pause Music') : (lang === 'ms' ? 'Mainkan Muzik Ceria' : 'Play Cheerful Music')}
        >
          {isPlaying ? (
            <>
              {/* Dancing sound bars animation */}
              <div className="flex items-center gap-0.5 h-3.5">
                <span className="w-1 bg-amber-950 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                <span className="w-1 bg-amber-950 rounded-full animate-bounce h-3.5" style={{ animationDelay: '150ms' }} />
                <span className="w-1 bg-amber-950 rounded-full animate-bounce h-2.5" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="hidden md:inline text-[11px] font-extrabold max-w-[85px] truncate">
                {lang === 'ms' ? activeTrackObj.nameMs.split(' ')[0] : activeTrackObj.nameEn.split(' ')[0]}
              </span>
            </>
          ) : (
            <>
              <Music className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline text-[11px]">
                {lang === 'ms' ? 'Muzik Ceria' : 'Play BGM'}
              </span>
            </>
          )}
        </button>

        {/* Volume & Settings Trigger */}
        <button
          onClick={() => {
            soundService.playPop();
            setIsOpen(!isOpen);
          }}
          className={`p-1.5 rounded-xl text-slate-500 hover:text-slate-800 transition-colors ${
            isOpen ? 'bg-amber-200 text-amber-900' : 'hover:bg-amber-200/50'
          }`}
          title={lang === 'ms' ? 'Kawal Kelantangan Muzik' : 'BGM Volume & Track Settings'}
        >
          {volume === 0 || !isPlaying ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : volume < 0.5 ? (
            <Volume1 className="w-3.5 h-3.5 text-amber-700" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
          )}
        </button>
      </div>

      {/* Dropdown Settings Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-3xl p-5 shadow-2xl border-2 border-amber-200 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                🎶
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 leading-tight">
                  {lang === 'ms' ? 'Muzik Latar Ceria' : 'Kids Background Music'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ms' ? 'Bunyi lembut & tenang untuk murid' : 'Gentle & calm sound for pupils'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control Section */}
          <div className="space-y-2 mb-4 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/60">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>{lang === 'ms' ? 'Kelantangan Muzik:' : 'Music Volume:'}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white font-extrabold text-amber-800 text-[11px] border border-amber-200">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-amber-200 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-0.5">
              <span>{lang === 'ms' ? 'Senyap' : 'Mute'}</span>
              <span className="text-amber-700 font-extrabold">{lang === 'ms' ? 'Lembut (Disyorkan)' : 'Soft (Recommended)'}</span>
              <span>{lang === 'ms' ? 'Sederhana' : 'Medium'}</span>
            </div>

            {/* Preset Buttons */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => handleVolumeChange(0.25)}
                className={`flex-1 py-1 rounded-lg text-[10px] font-black transition-all ${
                  Math.abs(volume - 0.25) < 0.05 ? 'bg-amber-500 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {lang === 'ms' ? 'Lembut (25%)' : 'Soft (25%)'}
              </button>
              <button
                onClick={() => handleVolumeChange(0.4)}
                className={`flex-1 py-1 rounded-lg text-[10px] font-black transition-all ${
                  Math.abs(volume - 0.4) < 0.05 ? 'bg-amber-500 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {lang === 'ms' ? 'Ideal (40%)' : 'Ideal (40%)'}
              </button>
              <button
                onClick={() => handleVolumeChange(0.65)}
                className={`flex-1 py-1 rounded-lg text-[10px] font-black transition-all ${
                  Math.abs(volume - 0.65) < 0.05 ? 'bg-amber-500 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {lang === 'ms' ? 'Selesa (65%)' : 'Clear (65%)'}
              </button>
            </div>
          </div>

          {/* Track Selection */}
          <div className="space-y-2 mb-4">
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
              {lang === 'ms' ? 'Pilih Irama Kanak-kanak:' : 'Select Kids Melody:'}
            </span>
            <div className="space-y-1.5">
              {BGM_TRACKS.map((track) => {
                const isSelected = currentTrack === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => handleSelectTrack(track.id)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50 text-amber-950 font-black shadow-xs ring-1 ring-amber-300'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-sm">🎵</span>
                      <span>{lang === 'ms' ? track.nameMs : track.nameEn}</span>
                    </div>
                    {isSelected && isPlaying && (
                      <span className="text-[10px] font-extrabold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                        {lang === 'ms' ? 'Sedang Main' : 'Playing'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SFX & Speech Toggles */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            {/* SFX toggle */}
            <button
              onClick={handleToggleSfx}
              className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                sfxEnabled ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              {sfxEnabled ? <Volume2 className="w-3.5 h-3.5 text-indigo-600" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{lang === 'ms' ? 'Kesan Bunyi' : 'SFX Sound'}</span>
            </button>

            {/* Speech voice toggle */}
            <button
              onClick={handleToggleSpeech}
              className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                speechEnabled ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>{lang === 'ms' ? 'Suara Cikgu' : 'Voice Guide'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
