import React from 'react';
import { 
  BookOpen, 
  PenTool, 
  Calculator, 
  MapPin, 
  Trophy, 
  User, 
  Volume2, 
  VolumeX, 
  Music, 
  Flame, 
  Coins, 
  Star, 
  CheckCircle2,
  Globe
} from 'lucide-react';
import { Language, MainTab, UserProfile } from '../types';
import { getAvatarById } from '../data/avatarsData';
import { soundService } from '../services/soundService';

interface NavbarProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  lang: Language;
  onToggleLang: () => void;
  profile: UserProfile;
  onOpenProfile: () => void;
  onOpenMissions: () => void;
  unclaimedMissionsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  profile,
  onOpenProfile,
  onOpenMissions,
  unclaimedMissionsCount,
}) => {
  const [bgmActive, setBgmActive] = React.useState(soundService.getIsBgmPlaying());
  const [sfxActive, setSfxActive] = React.useState(soundService.getSfxEnabled());
  const avatar = getAvatarById(profile.avatarId);

  const handleToggleBgm = () => {
    const active = soundService.toggleBgm();
    setBgmActive(active);
  };

  const handleToggleSfx = () => {
    const next = !sfxActive;
    soundService.setSfxEnabled(next);
    setSfxActive(next);
    if (next) soundService.playPop();
  };

  const navItems = [
    {
      id: 'map' as MainTab,
      labelMs: 'Peta Misi',
      labelEn: 'Mission Map',
      icon: MapPin,
      color: 'bg-emerald-500',
      activeColor: 'text-emerald-700 bg-emerald-100 ring-2 ring-emerald-400'
    },
    {
      id: 'reading' as MainTab,
      labelMs: 'Membaca',
      labelEn: 'Reading',
      icon: BookOpen,
      color: 'bg-blue-500',
      activeColor: 'text-blue-700 bg-blue-100 ring-2 ring-blue-400'
    },
    {
      id: 'writing' as MainTab,
      labelMs: 'Menulis',
      labelEn: 'Writing',
      icon: PenTool,
      color: 'bg-purple-500',
      activeColor: 'text-purple-700 bg-purple-100 ring-2 ring-purple-400'
    },
    {
      id: 'math' as MainTab,
      labelMs: 'Mengira',
      labelEn: 'Math',
      icon: Calculator,
      color: 'bg-amber-500',
      activeColor: 'text-amber-700 bg-amber-100 ring-2 ring-amber-400'
    },
    {
      id: 'leaderboard' as MainTab,
      labelMs: 'Papan Skor',
      labelEn: 'Leaderboard',
      icon: Trophy,
      color: 'bg-rose-500',
      activeColor: 'text-rose-700 bg-rose-100 ring-2 ring-rose-400'
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-amber-100">
      {/* Top Status & Currency Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* App Title & Brand */}
        <div 
          onClick={() => {
            soundService.playPop();
            onSelectTab('map');
          }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform text-white text-xl font-bold">
            3M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                Misi Mahir 3M
              </span>
              <span className="hidden md:inline-block px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-100 text-amber-800">
                {lang === 'ms' ? 'KPM Intervensi' : 'Primary 3M'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
              {lang === 'ms' ? 'Membaca • Menulis • Mengira' : 'Reading • Writing • Math'}
            </p>
          </div>
        </div>

        {/* Gamification Stats: Streak, Stars, Coins & Mission */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Daily Streak */}
          <div 
            title={lang === 'ms' ? `Rentetan Belajar: ${profile.streakDays} Hari` : `Study Streak: ${profile.streakDays} Days`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 text-xs sm:text-sm font-bold shadow-xs"
          >
            <Flame className="w-4 h-4 text-orange-500 animate-bounce-slow" />
            <span>{profile.streakDays}d</span>
          </div>

          {/* Stars */}
          <div 
            title={lang === 'ms' ? `Jumlah Bintang: ${profile.stars}` : `Total Stars: ${profile.stars}`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs sm:text-sm font-bold shadow-xs"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{profile.stars}</span>
          </div>

          {/* Coins */}
          <div 
            title={lang === 'ms' ? `Koin Emas: ${profile.coins}` : `Gold Coins: ${profile.coins}`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs sm:text-sm font-bold shadow-xs"
          >
            <Coins className="w-4 h-4 text-yellow-600" />
            <span>{profile.coins}</span>
          </div>

          {/* Daily Missions Quest Button */}
          <button
            onClick={() => {
              soundService.playPop();
              onOpenMissions();
            }}
            className="relative flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-bold transition-all shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">{lang === 'ms' ? 'Misi Harian' : 'Daily Quests'}</span>
            {unclaimedMissionsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-ping">
                {unclaimedMissionsCount}
              </span>
            )}
            {unclaimedMissionsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                {unclaimedMissionsCount}
              </span>
            )}
          </button>

          {/* Audio Controls */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {/* BGM Toggle */}
            <button
              onClick={handleToggleBgm}
              title={bgmActive ? (lang === 'ms' ? 'Matikan Muzik' : 'Mute Music') : (lang === 'ms' ? 'Pasang Muzik Ceria' : 'Play Cheerful BGM')}
              className={`p-1.5 rounded-lg transition-colors ${
                bgmActive ? 'bg-amber-400 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Music className={`w-3.5 h-3.5 ${bgmActive ? 'animate-pulse' : ''}`} />
            </button>

            {/* SFX Toggle */}
            <button
              onClick={handleToggleSfx}
              title={sfxActive ? (lang === 'ms' ? 'Matikan Kesan Bunyi' : 'Mute SFX') : (lang === 'ms' ? 'Aktifkan Kesan Bunyi' : 'Unmute SFX')}
              className={`p-1.5 rounded-lg transition-colors ${
                sfxActive ? 'bg-indigo-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {sfxActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => {
              soundService.playPop();
              onToggleLang();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
            title={lang === 'ms' ? 'Tukar ke English' : 'Switch to Bahasa Melayu'}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'ms' ? 'BM' : 'EN'}</span>
          </button>

          {/* Pupil Profile Button */}
          <button
            onClick={() => {
              soundService.playPop();
              onOpenProfile();
            }}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold transition-transform active:scale-95"
            title={lang === 'ms' ? 'Buka Profil Murid' : 'Open Pupil Profile'}
          >
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${avatar.bg} flex items-center justify-center text-base shadow-xs`}>
              {avatar.emoji}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-extrabold leading-tight truncate max-w-[80px]">
                {profile.nickname || profile.name}
              </div>
              <div className="text-[10px] text-amber-700 font-medium">
                Lv.{profile.level}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center justify-center sm:justify-start gap-1 sm:gap-2 overflow-x-auto py-1.5 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundService.playPop();
                onSelectTab(item.id);
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                isActive
                  ? item.activeColor
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span>{lang === 'ms' ? item.labelMs : item.labelEn}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
