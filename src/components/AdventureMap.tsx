import React from 'react';
import { 
  BookOpen, 
  PenTool, 
  Calculator, 
  Sparkles, 
  Star, 
  Award, 
  ChevronRight, 
  Compass, 
  CheckCircle,
  Play,
  Music,
  Volume2
} from 'lucide-react';
import { Language, MainTab, UserProfile } from '../types';
import { getAvatarById } from '../data/avatarsData';
import { soundService } from '../services/soundService';

interface AdventureMapProps {
  lang: Language;
  profile: UserProfile;
  onNavigate: (tab: MainTab) => void;
  onOpenMissions: () => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  lang,
  profile,
  onNavigate,
  onOpenMissions,
}) => {
  const [isMusicPlaying, setIsMusicPlaying] = React.useState(soundService.getIsBgmPlaying());
  const avatar = getAvatarById(profile.avatarId);

  // Next level progress calculation
  const currentLevelBaseXp = (profile.level - 1) * 200;
  const nextLevelXp = profile.level * 200;
  const xpInCurrentLevel = Math.max(0, profile.xp - currentLevelBaseXp);
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / 200) * 100));

  const islands = [
    {
      id: 'reading' as MainTab,
      titleMs: 'Pulau Membaca 📖',
      titleEn: 'Reading Island 📖',
      taglineMs: 'Kuasai Huruf, Suku Kata & Ayat',
      taglineEn: 'Master Letters, Syllables & Sentences',
      descriptionMs: 'Mengenal vokal A-E-I-O-U, cantum suku kata terbuka KV, teka perkataan bergambar dan bacaan cerita pendek.',
      descriptionEn: 'Learn vowels, match syllables into words, guess picture quizzes and practice fluent reading.',
      accentColor: 'from-blue-500 via-sky-500 to-indigo-600',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
      buttonBg: 'bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 shadow-blue-200',
      icon: BookOpen,
      completedCount: profile.readingCompletedCount,
      totalQuests: 4,
      activities: [
        { nameMs: 'Kenal Vokal & Fonik', nameEn: 'Vowels & Phonics' },
        { nameMs: 'Suku Kata Ria (KV)', nameEn: 'Syllables (KV)' },
        { nameMs: 'Teka Kata Bergambar', nameEn: 'Picture Word Quiz' },
        { nameMs: 'Bacaan Ayat Mudah', nameEn: 'Sentence Reading' }
      ]
    },
    {
      id: 'writing' as MainTab,
      titleMs: 'Pulau Menulis ✍️',
      titleEn: 'Writing Island ✍️',
      taglineMs: 'Garis Panduan, Lakaran & Susun Kata',
      taglineEn: 'Guided Tracing, Strokes & Word Scramble',
      descriptionMs: 'Papan tulis interaktif untuk melakar huruf besar, kecil, dan nombor. Susun jubin huruf untuk mengeja perkataan.',
      descriptionEn: 'Interactive tracing pad for tracing letters and numbers with dotted guides, plus word spelling scramble.',
      accentColor: 'from-purple-500 via-fuchsia-500 to-pink-600',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
      buttonBg: 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-purple-200',
      icon: PenTool,
      completedCount: profile.writingCompletedCount,
      totalQuests: 3,
      activities: [
        { nameMs: 'Papan Tulis & Tracing', nameEn: 'Writing Pad & Tracing' },
        { nameMs: 'Susun Huruf Kata', nameEn: 'Word Builder Scramble' },
        { nameMs: 'Isi Huruf Yang Hilang', nameEn: 'Missing Letter Puzzle' }
      ]
    },
    {
      id: 'math' as MainTab,
      titleMs: 'Pulau Mengira 🔢',
      titleEn: 'Math Island 🔢',
      taglineMs: 'Bilang Objek, Tambah, Tolak & Kuiz Kilat',
      taglineEn: 'Counting Objects, Plus, Minus & 60s Sprint',
      descriptionMs: 'Kira buah-buahan ceria satu persatu, selesaikan operasi tambah dan tolak visual, serta cabaran masa 60 saat.',
      descriptionEn: 'Count cheerful objects with interactive taps, visual addition, subtraction, and rapid 60-second math blitz.',
      accentColor: 'from-amber-500 via-orange-500 to-red-500',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      buttonBg: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-200',
      icon: Calculator,
      completedCount: profile.mathCompletedCount,
      totalQuests: 4,
      activities: [
        { nameMs: 'Kira Objek Ceria 1-20', nameEn: 'Count Cheerful Objects' },
        { nameMs: 'Tambah Visual Ria', nameEn: 'Visual Addition' },
        { nameMs: 'Tolak Seronok', nameEn: 'Visual Subtraction' },
        { nameMs: 'Kilat Pantas 60s', nameEn: '60-Second Math Blitz' }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Adventure Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 p-6 sm:p-8 text-white shadow-xl">
        {/* Background decorative SVG circles & clouds */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-amber-300/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Pupil Info & Greeting */}
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr ${avatar.bg} border-4 border-white/80 shadow-lg flex items-center justify-center text-4xl sm:text-5xl transform hover:rotate-6 transition-transform`}>
              {avatar.emoji}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 backdrop-blur-xs text-xs font-bold uppercase tracking-wider mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>{lang === 'ms' ? 'Pengembaraan 3M Hari Ini' : 'Today\'s 3M Quest'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black drop-shadow-sm">
                {lang === 'ms' 
                  ? `Hai, ${profile.nickname || profile.name}! 🌟` 
                  : `Hello, ${profile.nickname || profile.name}! 🌟`}
              </h1>
              <p className="text-white/90 text-sm max-w-md font-medium mt-1">
                {lang === 'ms'
                  ? 'Selamat datang ke Pulau Misi Mahir 3M. Pilih pulau kegemaran anda untuk mula membaca, menulis dan mengira!'
                  : 'Welcome to the 3M Archipelago. Choose your favorite island to start reading, writing, and math!'}
              </p>

              {/* Cheerful Kids Music Toggle Pill */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <button
                  onClick={() => {
                    const active = soundService.toggleBgm();
                    setIsMusicPlaying(active);
                    if (active) soundService.playPop();
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 shadow-sm ${
                    isMusicPlaying
                      ? 'bg-amber-400 text-amber-950 ring-2 ring-white/60'
                      : 'bg-white/25 hover:bg-white/35 text-white backdrop-blur-xs'
                  }`}
                >
                  <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
                  <span>
                    {isMusicPlaying
                      ? (lang === 'ms' ? 'Muzik Ceria Sedang Main 🎶' : 'Cheerful BGM Playing 🎶')
                      : (lang === 'ms' ? 'Pasang Muzik Latar Ceria 🎵' : 'Play Kids Background Music 🎵')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Level Progress Widget */}
          <div className="w-full md:w-72 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 text-white shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span>{lang === 'ms' ? `Tahap ${profile.level}` : `Level ${profile.level}`}</span>
              <span>{xpInCurrentLevel} / 200 XP</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-amber-300 to-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-white/80 mt-2 font-medium">
              <span>{lang === 'ms' ? `Rentetan: ${profile.streakDays} Hari 🔥` : `Streak: ${profile.streakDays} Days 🔥`}</span>
              <span>{lang === 'ms' ? `${profile.unlockedBadgeIds.length} Lencana 🏅` : `${profile.unlockedBadgeIds.length} Badges 🏅`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Daily Mission Quest Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl shadow-xs">
            🎯
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base">
              {lang === 'ms' ? 'Misi Harian Murid Rajin' : 'Diligent Pupil Daily Quests'}
            </h3>
            <p className="text-xs text-amber-800">
              {lang === 'ms' ? 'Selesaikan misi harian untuk kumpul lebih banyak Koin Emas dan XP!' : 'Finish your daily missions to collect extra Gold Coins and XP!'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            soundService.playPop();
            onOpenMissions();
          }}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
        >
          <Award className="w-4 h-4" />
          <span>{lang === 'ms' ? 'Buka Senarai Misi' : 'Open Daily Quests'}</span>
        </button>
      </div>

      {/* The 3 Main Islands */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {islands.map((island) => {
          const Icon = island.icon;
          return (
            <div
              key={island.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white border-2 border-slate-100 hover:border-slate-300 shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Island Header with Gradient */}
              <div className={`p-6 bg-gradient-to-br ${island.accentColor} text-white relative overflow-hidden`}>
                <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/15 blur-lg pointer-events-none group-hover:scale-125 transition-transform" />
                
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs">
                    {island.completedCount} {lang === 'ms' ? 'selesai' : 'done'}
                  </span>
                </div>

                <h2 className="text-xl font-black mt-4">
                  {lang === 'ms' ? island.titleMs : island.titleEn}
                </h2>
                <p className="text-xs text-white/90 font-medium mt-1">
                  {lang === 'ms' ? island.taglineMs : island.taglineEn}
                </p>
              </div>

              {/* Island Details & Activities List */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {lang === 'ms' ? island.descriptionMs : island.descriptionEn}
                </p>

                {/* Sub-activities pills */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {lang === 'ms' ? 'Kandungan Pembelajaran:' : 'Learning Modules:'}
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {island.activities.map((act, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{lang === 'ms' ? act.nameMs : act.nameEn}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    soundService.playSuccess();
                    onNavigate(island.id);
                  }}
                  className={`w-full py-3 px-4 rounded-2xl text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${island.buttonBg}`}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>
                    {lang === 'ms' 
                      ? `Terokai ${island.titleMs.split(' ')[1]}` 
                      : `Explore ${island.titleEn.split(' ')[0]}`}
                  </span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Bottom Quote */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-teal-200 flex items-center gap-4 text-teal-900">
        <div className="text-3xl shrink-0">🌱</div>
        <div>
          <h4 className="font-extrabold text-sm">
            {lang === 'ms' ? 'Kata Semangat Guru 3M:' : 'Teacher\'s Word of Encouragement:'}
          </h4>
          <p className="text-xs text-teal-800 mt-0.5">
            {lang === 'ms' 
              ? '"Membaca jambatan ilmu, menulis mencatat cita-cita, mengira melatih minda pintar. Teruskan usaha hebatmu setiap hari!"'
              : '"Reading is the bridge to knowledge, writing records your dreams, counting trains a sharp mind. Keep up the awesome effort every day!"'}
          </p>
        </div>
      </div>
    </div>
  );
};
