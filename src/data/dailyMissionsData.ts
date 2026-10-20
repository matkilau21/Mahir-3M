import { DailyMission } from '../types';

export const DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'dm_read',
    titleMs: 'Peneroka Membaca',
    titleEn: 'Reading Explorer',
    descMs: 'Selesaikan 2 latihan di Pulau Membaca',
    descEn: 'Complete 2 exercises in Reading Island',
    xpReward: 60,
    coinsReward: 25,
    totalRequired: 2,
    type: 'reading'
  },
  {
    id: 'dm_write',
    titleMs: 'Goresan Pensel Emas',
    titleEn: 'Golden Pencil Strokes',
    descMs: 'Tulis atau susun perkataan di Pulau Menulis',
    descEn: 'Write or scramble words in Writing Island',
    xpReward: 60,
    coinsReward: 25,
    totalRequired: 2,
    type: 'writing'
  },
  {
    id: 'dm_math',
    titleMs: 'Kira Objek Ceria',
    titleEn: 'Cheerful Object Count',
    descMs: 'Lengkapkan 2 latihan mengira atau operasi nombor',
    descEn: 'Complete 2 counting or math operations',
    xpReward: 60,
    coinsReward: 25,
    totalRequired: 2,
    type: 'math'
  },
  {
    id: 'dm_speed',
    titleMs: 'Cabaran Laju 60 Saat',
    titleEn: '60s Speed Sprint',
    descMs: 'Uji kepantasan minda dalam cabaran kuiz pantas',
    descEn: 'Test your brain speed in the fast math sprint',
    xpReward: 80,
    coinsReward: 35,
    totalRequired: 1,
    type: 'speed_math'
  }
];
