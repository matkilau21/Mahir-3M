import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Star, 
  Award, 
  Crown, 
  Sparkles, 
  TrendingUp, 
  Search,
  Filter
} from 'lucide-react';
import { Language, LeaderboardEntry, UserProfile } from '../types';
import { getSortedLeaderboardWithPlayer } from '../data/mockLeaderboard';
import { getAvatarById } from '../data/avatarsData';
import { soundService } from '../services/soundService';

interface LeaderboardViewProps {
  lang: Language;
  profile: UserProfile;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ lang, profile }) => {
  const [period, setPeriod] = useState<'weekly' | 'allTime'>('weekly');
  const [filterCategory, setFilterCategory] = useState<'all' | 'reading' | 'writing' | 'math'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch sorted leaderboard dynamically with user
  const entries = getSortedLeaderboardWithPlayer(
    profile.xp,
    profile.name,
    profile.nickname,
    profile.avatarId,
    profile.grade,
    profile.stars,
    profile.unlockedBadgeIds.length
  );

  // Apply search query filter
  const filteredEntries = entries.filter((entry) => {
    const q = searchQuery.toLowerCase();
    return entry.name.toLowerCase().includes(q) || entry.nickname.toLowerCase().includes(q);
  });

  const top3 = entries.slice(0, 3);
  const userEntry = entries.find((e) => e.isUser);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Leaderboard Header */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
            🏆
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-1">
              {lang === 'ms' ? 'Pentas Juara 3M' : '3M Champions Stage'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              {lang === 'ms' ? 'Papan Pendahulu Interaktif' : 'Interactive Leaderboard'}
            </h1>
            <p className="text-xs sm:text-sm text-white/90">
              {lang === 'ms' 
                ? 'Sertai persaingan sihat rakan-rakan sebaya seluruh negara untuk tingkatkan motivasi belajar!' 
                : 'Join healthy peer learning challenges across the nation to boost your learning motivation!'}
            </p>
          </div>
        </div>

        {/* Time Period Filter Pills */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-2xl backdrop-blur-md">
          <button
            onClick={() => {
              soundService.playPop();
              setPeriod('weekly');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
              period === 'weekly' ? 'bg-white text-rose-700 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {lang === 'ms' ? 'Mingguan' : 'Weekly'}
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setPeriod('allTime');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
              period === 'allTime' ? 'bg-white text-rose-700 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {lang === 'ms' ? 'Sepanjang Masa' : 'All-Time'}
          </button>
        </div>
      </div>

      {/* User's Current Stand Banner */}
      {userEntry && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-100 border-2 border-amber-300 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center text-lg shadow-xs">
              #{userEntry.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-amber-950">
                  {lang === 'ms' ? 'Kedudukan Semasa Anda' : 'Your Current Rank'}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  {lang === 'ms' ? 'Aktif' : 'Active'}
                </span>
              </div>
              <p className="text-xs text-amber-800">
                {lang === 'ms'
                  ? `Tahniah ${profile.nickname || profile.name}! Anda mengumpul ${profile.xp} XP & ${profile.stars} Bintang.`
                  : `Great job ${profile.nickname || profile.name}! You have collected ${profile.xp} XP & ${profile.stars} Stars.`}
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-amber-900 block">
              {lang === 'ms' ? 'Rentetan Belajar' : 'Study Streak'}
            </span>
            <span className="text-sm font-black text-orange-600">
              🔥 {profile.streakDays} {lang === 'ms' ? 'Hari' : 'Days'}
            </span>
          </div>
        </div>
      )}

      {/* Podium for Top 3 Champions */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-8 pb-4">
        {/* 2nd Place (Silver) */}
        {top3[1] && (
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-400 border-4 border-slate-300 flex items-center justify-center text-3xl sm:text-4xl shadow-md">
                {getAvatarById(top3[1].avatarId).emoji}
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-slate-300 border-2 border-white text-slate-800 font-black text-xs flex items-center justify-center shadow-xs">
                2
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 truncate max-w-[100px] sm:max-w-[130px]">
                {top3[1].nickname}
              </h4>
              <span className="text-[11px] font-bold text-slate-500 block">{top3[1].xp} XP</span>
            </div>
            {/* Podium step */}
            <div className="w-full h-24 sm:h-28 rounded-t-2xl bg-gradient-to-t from-slate-300 to-slate-200 border-t-4 border-slate-400 flex items-center justify-center mt-2 shadow-inner">
              <span className="text-xl sm:text-2xl font-black text-slate-600">🥈</span>
            </div>
          </div>
        )}

        {/* 1st Place (Gold Champion) */}
        {top3[0] && (
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <Crown className="w-6 h-6 text-amber-500 mx-auto animate-bounce-slow" />
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-300 to-yellow-500 border-4 border-amber-300 flex items-center justify-center text-4xl sm:text-5xl shadow-xl ring-4 ring-amber-200">
                {getAvatarById(top3[0].avatarId).emoji}
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-400 border-2 border-white text-amber-950 font-black text-xs flex items-center justify-center shadow-xs">
                1
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-extrabold text-xs sm:text-base text-amber-950 truncate max-w-[110px] sm:max-w-[150px]">
                {top3[0].nickname}
              </h4>
              <span className="text-xs font-black text-amber-600 block">{top3[0].xp} XP</span>
            </div>
            {/* Podium step */}
            <div className="w-full h-32 sm:h-36 rounded-t-3xl bg-gradient-to-t from-amber-400 to-amber-300 border-t-4 border-amber-500 flex flex-col items-center justify-center mt-2 shadow-inner">
              <span className="text-3xl sm:text-4xl font-black text-amber-800">🥇</span>
              <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest mt-1">Juara</span>
            </div>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {top3[2] && (
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-700 to-orange-800 border-4 border-amber-600 flex items-center justify-center text-3xl sm:text-4xl shadow-md">
                {getAvatarById(top3[2].avatarId).emoji}
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-amber-700 border-2 border-white text-white font-black text-xs flex items-center justify-center shadow-xs">
                3
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 truncate max-w-[100px] sm:max-w-[130px]">
                {top3[2].nickname}
              </h4>
              <span className="text-[11px] font-bold text-slate-500 block">{top3[2].xp} XP</span>
            </div>
            {/* Podium step */}
            <div className="w-full h-20 sm:h-24 rounded-t-2xl bg-gradient-to-t from-amber-600/40 to-amber-500/30 border-t-4 border-amber-600 flex items-center justify-center mt-2 shadow-inner">
              <span className="text-xl sm:text-2xl font-black text-amber-800">🥉</span>
            </div>
          </div>
        )}
      </div>

      {/* Rankings List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'ms' ? 'Cari nama murid...' : 'Search student name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'ms' ? 'Tunjuk Murid:' : 'Showing Pupils:'}
            </span>
            <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
              {filteredEntries.length}
            </span>
          </div>
        </div>

        {/* Entries List */}
        <div className="divide-y divide-slate-100">
          {filteredEntries.map((item) => {
            const avatar = getAvatarById(item.avatarId);
            const isSelf = item.isUser;

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3.5 sm:p-4 transition-colors ${
                  isSelf
                    ? 'bg-amber-50/80 border-l-4 border-l-amber-500 font-bold'
                    : 'hover:bg-slate-50'
                }`}
              >
                {/* Rank & Pupil Details */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-8 h-8 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center shrink-0 ${
                    item.rank === 1
                      ? 'bg-amber-400 text-amber-950'
                      : item.rank === 2
                      ? 'bg-slate-300 text-slate-800'
                      : item.rank === 3
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    #{item.rank}
                  </div>

                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${avatar.bg} flex items-center justify-center text-xl shrink-0 shadow-xs`}>
                    {avatar.emoji}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                        {item.name}
                      </span>
                      {isSelf && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900">
                          {lang === 'ms' ? 'Anda' : 'You'}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {item.grade} • {item.badgesCount} {lang === 'ms' ? 'Lencana' : 'Badges'}
                    </span>
                  </div>
                </div>

                {/* Score & Stars */}
                <div className="flex items-center gap-4 text-right">
                  <div className="flex items-center gap-1 text-amber-500 text-xs sm:text-sm font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{item.stars}</span>
                  </div>
                  <div className="w-20 sm:w-24 text-right">
                    <span className="font-black text-xs sm:text-sm text-slate-900 block">
                      {item.xp} XP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
