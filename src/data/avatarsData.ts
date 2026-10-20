import { AvatarOption } from '../types';

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'kancil',
    nameMs: 'Sang Kancil Bijak',
    nameEn: 'Clever Mousedeer',
    emoji: '🦌',
    bg: 'from-amber-400 to-orange-500',
    animal: 'Kancil'
  },
  {
    id: 'harimau',
    nameMs: 'Pak Belang Berani',
    nameEn: 'Brave Tiger',
    emoji: '🐯',
    bg: 'from-orange-500 to-amber-600',
    animal: 'Harimau'
  },
  {
    id: 'arnab',
    nameMs: 'Arnab Si Laju',
    nameEn: 'Speedy Bunny',
    emoji: '🐰',
    bg: 'from-pink-400 to-rose-500',
    animal: 'Arnab'
  },
  {
    id: 'kucing',
    nameMs: 'Oyen Si Ceria',
    nameEn: 'Cheerful Ginger Cat',
    emoji: '🐱',
    bg: 'from-yellow-400 to-amber-500',
    animal: 'Kucing'
  },
  {
    id: 'helang',
    nameMs: 'Helang Perkasa',
    nameEn: 'Mighty Eagle',
    emoji: '🦅',
    bg: 'from-sky-400 to-blue-600',
    animal: 'Helang'
  },
  {
    id: 'gajah',
    nameMs: 'Gajah Cerdik',
    nameEn: 'Smart Elephant',
    emoji: '🐘',
    bg: 'from-emerald-400 to-teal-600',
    animal: 'Gajah'
  },
  {
    id: 'penyu',
    nameMs: 'Penyu Tabah',
    nameEn: 'Steady Turtle',
    emoji: '🐢',
    bg: 'from-teal-400 to-cyan-600',
    animal: 'Penyu'
  },
  {
    id: 'beruang',
    nameMs: 'Beruang Madu',
    nameEn: 'Honey Sun Bear',
    emoji: '🐻',
    bg: 'from-yellow-500 to-amber-700',
    animal: 'Beruang'
  }
];

export const getAvatarById = (id: string): AvatarOption => {
  return AVATAR_OPTIONS.find(a => a.id === id) || AVATAR_OPTIONS[0];
};
