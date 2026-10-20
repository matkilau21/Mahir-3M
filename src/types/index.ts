export type Language = 'ms' | 'en';

export type MainTab = 'map' | 'reading' | 'writing' | 'math' | 'leaderboard' | 'profile';

export type GradeLevel = 'Prasekolah' | 'Tahun 1' | 'Tahun 2' | 'Tahun 3' | 'Pemulihan Khas';

export interface AvatarOption {
  id: string;
  nameMs: string;
  nameEn: string;
  emoji: string;
  bg: string;
  animal: string;
}

export interface Badge {
  id: string;
  titleMs: string;
  titleEn: string;
  descMs: string;
  descEn: string;
  icon: string;
  color: string;
  category: 'all' | 'reading' | 'writing' | 'math' | 'streak';
  reqDescriptionMs: string;
  reqDescriptionEn: string;
}

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  grade: GradeLevel;
  schoolName: string;
  avatarId: string;
  xp: number;
  level: number;
  stars: number;
  coins: number;
  streakDays: number;
  lastActiveDate: string;
  
  // Progress counters
  readingCompletedCount: number;
  writingCompletedCount: number;
  mathCompletedCount: number;
  
  // High scores
  speedMathBestScore: number;
  
  unlockedBadgeIds: string[];
  claimedDailyMissionIds: string[];
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  nickname: string;
  grade: string;
  avatarId: string;
  xp: number;
  stars: number;
  badgesCount: number;
  isUser?: boolean;
}

export interface DailyMission {
  id: string;
  titleMs: string;
  titleEn: string;
  descMs: string;
  descEn: string;
  xpReward: number;
  coinsReward: number;
  totalRequired: number;
  type: 'reading' | 'writing' | 'math' | 'speed_math' | 'all';
}
