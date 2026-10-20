import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AdventureMap } from './components/AdventureMap';
import { ReadingIsland } from './components/ReadingIsland';
import { WritingIsland } from './components/WritingIsland';
import { MathIsland } from './components/MathIsland';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { BadgeUnlockModal } from './components/BadgeUnlockModal';
import { DailyMissionsModal } from './components/DailyMissionsModal';
import { Language, MainTab, UserProfile, Badge, DailyMission } from './types';
import { BADGES_DATA } from './data/badgesData';
import { DAILY_MISSIONS } from './data/dailyMissionsData';
import { soundService } from './services/soundService';

const STORAGE_KEY = 'misi_mahir_3m_pupil_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  id: 'pupil_01',
  name: 'Nur Iman Hakim',
  nickname: 'Iman',
  grade: 'Tahun 1',
  schoolName: 'SK Taman Bintang Perdana',
  avatarId: 'kancil',
  xp: 320,
  level: 2,
  stars: 14,
  coins: 55,
  streakDays: 3,
  lastActiveDate: new Date().toISOString(),
  readingCompletedCount: 2,
  writingCompletedCount: 1,
  mathCompletedCount: 2,
  speedMathBestScore: 6,
  unlockedBadgeIds: ['first_step', 'vowel_champ'],
  claimedDailyMissionIds: [],
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<MainTab>('map');
  const [lang, setLang] = useState<Language>('ms');
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  });

  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<Badge | null>(null);
  const [isMissionsOpen, setIsMissionsOpen] = useState(false);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Sync language with SoundService for speech synthesis
  useEffect(() => {
    soundService.setLanguage(lang);
  }, [lang]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ms' ? 'en' : 'ms'));
  };

  // Check and unlock badges based on student progress
  const checkBadges = (updated: UserProfile) => {
    const newlyUnlocked: Badge[] = [];

    BADGES_DATA.forEach((badge) => {
      if (updated.unlockedBadgeIds.includes(badge.id)) return;

      let qualified = false;
      if (badge.id === 'first_step') {
        qualified = updated.readingCompletedCount + updated.writingCompletedCount + updated.mathCompletedCount >= 1;
      } else if (badge.id === 'vowel_champ') {
        qualified = updated.readingCompletedCount >= 1;
      } else if (badge.id === 'syllable_king') {
        qualified = updated.readingCompletedCount >= 2;
      } else if (badge.id === 'story_explorer') {
        qualified = updated.readingCompletedCount >= 3;
      } else if (badge.id === 'magic_pen') {
        qualified = updated.writingCompletedCount >= 1;
      } else if (badge.id === 'word_builder') {
        qualified = updated.writingCompletedCount >= 2;
      } else if (badge.id === 'counting_star') {
        qualified = updated.mathCompletedCount >= 1;
      } else if (badge.id === 'addition_ace') {
        qualified = updated.mathCompletedCount >= 2;
      } else if (badge.id === 'subtraction_hero') {
        qualified = updated.mathCompletedCount >= 3;
      } else if (badge.id === 'speed_demon') {
        qualified = updated.speedMathBestScore >= 5;
      } else if (badge.id === 'streak_champ') {
        qualified = updated.streakDays >= 3;
      } else if (badge.id === 'grand_champion') {
        qualified = updated.readingCompletedCount >= 1 && updated.writingCompletedCount >= 1 && updated.mathCompletedCount >= 1;
      }

      if (qualified) {
        newlyUnlocked.push(badge);
      }
    });

    if (newlyUnlocked.length > 0) {
      const addedIds = newlyUnlocked.map((b) => b.id);
      setProfile((prev) => ({
        ...prev,
        xp: prev.xp + 50 * newlyUnlocked.length,
        unlockedBadgeIds: [...prev.unlockedBadgeIds, ...addedIds],
      }));
      setNewBadgeUnlocked(newlyUnlocked[0]);
    }
  };

  // Reward handler triggered on activity completions
  const handleEarnRewards = (
    xpGain: number,
    starsGain: number,
    coinsGain: number,
    activityType: 'reading' | 'writing' | 'math',
    speedScore?: number
  ) => {
    soundService.playCoin();

    setProfile((prev) => {
      const newXp = prev.xp + xpGain;
      const newLevel = Math.max(1, Math.floor(newXp / 200) + 1);
      const newStars = prev.stars + starsGain;
      const newCoins = prev.coins + coinsGain;

      let rCount = prev.readingCompletedCount;
      let wCount = prev.writingCompletedCount;
      let mCount = prev.mathCompletedCount;

      if (activityType === 'reading') rCount += 1;
      if (activityType === 'writing') wCount += 1;
      if (activityType === 'math') mCount += 1;

      const newSpeed = speedScore !== undefined ? Math.max(prev.speedMathBestScore, speedScore) : prev.speedMathBestScore;

      const updated: UserProfile = {
        ...prev,
        xp: newXp,
        level: newLevel,
        stars: newStars,
        coins: newCoins,
        readingCompletedCount: rCount,
        writingCompletedCount: wCount,
        mathCompletedCount: mCount,
        speedMathBestScore: newSpeed,
      };

      // Check badges asynchronously
      setTimeout(() => checkBadges(updated), 400);

      return updated;
    });
  };

  const handleUpdateProfile = (partial: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const handleClaimDailyMission = (mission: DailyMission) => {
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + mission.xpReward,
      coins: prev.coins + mission.coinsReward,
      claimedDailyMissionIds: [...prev.claimedDailyMissionIds, mission.id],
    }));
  };

  // Unclaimed missions counter for badge indicator
  const unclaimedMissionsCount = DAILY_MISSIONS.filter((m) => {
    let current = 0;
    if (m.type === 'reading') current = profile.readingCompletedCount;
    else if (m.type === 'writing') current = profile.writingCompletedCount;
    else if (m.type === 'math') current = profile.mathCompletedCount;
    else if (m.type === 'speed_math') current = profile.speedMathBestScore > 0 ? 1 : 0;

    const isCompleted = current >= m.totalRequired;
    const isClaimed = profile.claimedDailyMissionIds.includes(m.id);
    return isCompleted && !isClaimed;
  }).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={lang}
        onToggleLang={handleToggleLang}
        profile={profile}
        onOpenProfile={() => setCurrentTab('profile')}
        onOpenMissions={() => setIsMissionsOpen(true)}
        unclaimedMissionsCount={unclaimedMissionsCount}
      />

      {/* Main Island Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex-1 w-full">
        {currentTab === 'map' && (
          <AdventureMap
            lang={lang}
            profile={profile}
            onNavigate={setCurrentTab}
            onOpenMissions={() => setIsMissionsOpen(true)}
          />
        )}

        {currentTab === 'reading' && (
          <ReadingIsland
            lang={lang}
            onEarnRewards={handleEarnRewards}
          />
        )}

        {currentTab === 'writing' && (
          <WritingIsland
            lang={lang}
            onEarnRewards={handleEarnRewards}
          />
        )}

        {currentTab === 'math' && (
          <MathIsland
            lang={lang}
            onEarnRewards={handleEarnRewards}
            bestSpeedScore={profile.speedMathBestScore}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView
            lang={lang}
            profile={profile}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            lang={lang}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Badge Unlock Celebration Modal */}
      <BadgeUnlockModal
        badge={newBadgeUnlocked}
        onClose={() => setNewBadgeUnlocked(null)}
        lang={lang}
      />

      {/* Daily Quests Modal */}
      <DailyMissionsModal
        isOpen={isMissionsOpen}
        onClose={() => setIsMissionsOpen(false)}
        lang={lang}
        profile={profile}
        onClaimReward={handleClaimDailyMission}
      />

      {/* Playful Educational Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center">
              3M
            </span>
            <span className="font-extrabold text-slate-700">Misi Mahir 3M</span>
            <span>•</span>
            <span>{lang === 'ms' ? 'Inisiatif Penguasaan Membaca, Menulis & Mengira' : 'Primary Reading, Writing & Math Initiative'}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>{lang === 'ms' ? 'Mesra Murid Prasekolah & Tahun 1-3' : 'Friendly for Preschool & Primary Grades'}</span>
            <span>•</span>
            <span>{lang === 'ms' ? 'Sokongan Dwi-Bahasa BM & EN' : 'Bilingual BM & EN'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
