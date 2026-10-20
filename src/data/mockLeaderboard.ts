import { LeaderboardEntry } from '../types';

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'p1',
    rank: 1,
    name: 'Afiq Haiqal',
    nickname: 'Afiq Juara',
    grade: 'Tahun 2',
    avatarId: 'harimau',
    xp: 2450,
    stars: 88,
    badgesCount: 9,
  },
  {
    id: 'p2',
    rank: 2,
    name: 'Nur Damia Insyirah',
    nickname: 'Mia Pintar',
    grade: 'Tahun 1',
    avatarId: 'arnab',
    xp: 2280,
    stars: 82,
    badgesCount: 8,
  },
  {
    id: 'p3',
    rank: 3,
    name: 'Darren Tan',
    nickname: 'Darren',
    grade: 'Tahun 2',
    avatarId: 'kucing',
    xp: 1950,
    stars: 68,
    badgesCount: 7,
  },
  {
    id: 'p4',
    rank: 4,
    name: 'Priya Letchumi',
    nickname: 'Priya',
    grade: 'Tahun 3',
    avatarId: 'helang',
    xp: 1720,
    stars: 59,
    badgesCount: 6,
  },
  {
    id: 'p5',
    rank: 5,
    name: 'Danish Rayyan',
    nickname: 'Danish',
    grade: 'Tahun 1',
    avatarId: 'kancil',
    xp: 1540,
    stars: 50,
    badgesCount: 5,
  },
  {
    id: 'p6',
    rank: 6,
    name: 'Siti Aisyah',
    nickname: 'Aisyah',
    grade: 'Tahun 2',
    avatarId: 'gajah',
    xp: 1390,
    stars: 44,
    badgesCount: 5,
  },
  {
    id: 'p7',
    rank: 7,
    name: 'Adam Mikhail',
    nickname: 'Adam',
    grade: 'Pemulihan Khas',
    avatarId: 'beruang',
    xp: 1180,
    stars: 38,
    badgesCount: 4,
  },
  {
    id: 'p8',
    rank: 8,
    name: 'Mei Ling',
    nickname: 'Ling',
    grade: 'Tahun 1',
    avatarId: 'penyu',
    xp: 960,
    stars: 30,
    badgesCount: 3,
  }
];

export const getSortedLeaderboardWithPlayer = (
  playerXp: number,
  playerName: string,
  playerNickname: string,
  playerAvatar: string,
  playerGrade: string,
  playerStars: number,
  playerBadgesCount: number
): LeaderboardEntry[] => {
  const userEntry: LeaderboardEntry = {
    id: 'user_player',
    rank: 0,
    name: playerName,
    nickname: playerNickname,
    grade: playerGrade,
    avatarId: playerAvatar,
    xp: playerXp,
    stars: playerStars,
    badgesCount: playerBadgesCount,
    isUser: true
  };

  const all = [...INITIAL_LEADERBOARD, userEntry];
  all.sort((a, b) => b.xp - a.xp);

  return all.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
};
