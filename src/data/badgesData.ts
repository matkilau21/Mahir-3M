import { Badge } from '../types';

export const BADGES_DATA: Badge[] = [
  {
    id: 'first_step',
    titleMs: 'Langkah Pertama',
    titleEn: 'First Step',
    descMs: 'Tahniah! Memulakan pengembaraan pertama di Misi Mahir 3M.',
    descEn: 'Congrats! Began the very first journey in Misi Mahir 3M.',
    icon: '🌟',
    color: 'from-amber-400 to-yellow-500',
    category: 'all',
    reqDescriptionMs: 'Selesaikan 1 aktiviti apa jua modul',
    reqDescriptionEn: 'Complete 1 activity of any module'
  },
  {
    id: 'vowel_champ',
    titleMs: 'Jaguh Vokal',
    titleEn: 'Vowel Master',
    descMs: 'Pakar mengenal dan membunyikan vokal A, E, I, O, U!',
    descEn: 'Master of identifying and pronouncing vowels A, E, I, O, U!',
    icon: '🗣️',
    color: 'from-red-400 to-rose-500',
    category: 'reading',
    reqDescriptionMs: 'Selesaikan latihan Vokal & Fonik',
    reqDescriptionEn: 'Complete Vowels & Phonics exercise'
  },
  {
    id: 'syllable_king',
    titleMs: 'Raja Suku Kata',
    titleEn: 'Syllable King',
    descMs: 'Hebat mencantum suku kata terbuka dan tertutup!',
    descEn: 'Awesome at combining open and closed syllables!',
    icon: '📚',
    color: 'from-blue-400 to-indigo-500',
    category: 'reading',
    reqDescriptionMs: 'Kuasai suku kata KV di Pulau Membaca',
    reqDescriptionEn: 'Master syllables in Reading Island'
  },
  {
    id: 'story_explorer',
    titleMs: 'Peminat Cerita',
    titleEn: 'Story Explorer',
    descMs: 'Berjaya membaca ayat mudah dengan lancar dan berintonasi.',
    descEn: 'Fluently read simple sentences with great rhythm.',
    icon: '📖',
    color: 'from-cyan-400 to-teal-500',
    category: 'reading',
    reqDescriptionMs: 'Lengkapkan modul Membaca Ayat',
    reqDescriptionEn: 'Complete Sentence Reading module'
  },
  {
    id: 'magic_pen',
    titleMs: 'Tangan Seni',
    titleEn: 'Magic Pencil',
    descMs: 'Tulisan kemas dan mengikut bentuk huruf yang betul!',
    descEn: 'Neat handwriting following correct letter shapes!',
    icon: '✏️',
    color: 'from-purple-400 to-pink-500',
    category: 'writing',
    reqDescriptionMs: 'Lengkapkan latihan melakar huruf di Papan Tulis',
    reqDescriptionEn: 'Complete letter tracing on the Writing Pad'
  },
  {
    id: 'word_builder',
    titleMs: 'Pembina Kata',
    titleEn: 'Word Builder',
    descMs: 'Bijak menyusun blok huruf membentuk perkataan bermakna.',
    descEn: 'Clever at arranging letter blocks into meaningful words.',
    icon: '🧩',
    color: 'from-emerald-400 to-green-600',
    category: 'writing',
    reqDescriptionMs: 'Lengkapkan 3 cabaran susun huruf',
    reqDescriptionEn: 'Complete 3 word scramble challenges'
  },
  {
    id: 'counting_star',
    titleMs: 'Bintang Mengira',
    titleEn: 'Counting Star',
    descMs: 'Tepat dan pantas membilang bilangan objek ceria!',
    descEn: 'Accurate and quick at counting cheerful objects!',
    icon: '⭐',
    color: 'from-yellow-400 to-amber-500',
    category: 'math',
    reqDescriptionMs: 'Lengkapkan kuiz mengira objek 1-20',
    reqDescriptionEn: 'Complete counting objects 1-20'
  },
  {
    id: 'addition_ace',
    titleMs: 'Jaguh Tambah',
    titleEn: 'Addition Ace',
    descMs: 'Pakar menjumlahkan nombor dan objek dengan betul.',
    descEn: 'Ace at adding up numbers and objects accurately.',
    icon: '➕',
    color: 'from-orange-400 to-red-500',
    category: 'math',
    reqDescriptionMs: 'Selesaikan cabaran Tambah Nombor',
    reqDescriptionEn: 'Complete Addition challenge'
  },
  {
    id: 'subtraction_hero',
    titleMs: 'Wira Tolak',
    titleEn: 'Subtraction Hero',
    descMs: 'Pakar operasi tolak dan pengurangan baki.',
    descEn: 'Expert in subtraction operations and balances.',
    icon: '➖',
    color: 'from-blue-500 to-cyan-500',
    category: 'math',
    reqDescriptionMs: 'Selesaikan cabaran Tolak Nombor',
    reqDescriptionEn: 'Complete Subtraction challenge'
  },
  {
    id: 'speed_demon',
    titleMs: 'Kilat Cepat 60s',
    titleEn: 'Lightning Quick 60s',
    descMs: 'Menjawab lebih daripada 5 soalan dalam cabaran pantas 60 saat!',
    descEn: 'Answered over 5 questions in the 60-second speed math challenge!',
    icon: '⚡',
    color: 'from-amber-300 to-yellow-500',
    category: 'math',
    reqDescriptionMs: 'Skor 5+ dalam Kuiz Kilat Mengira',
    reqDescriptionEn: 'Score 5+ in Speed Math challenge'
  },
  {
    id: 'streak_champ',
    titleMs: 'Juara Rajin',
    titleEn: 'Daily Champion',
    descMs: 'Mengekalkan rentetan belajar secara berterusan!',
    descEn: 'Maintained a persistent active learning streak!',
    icon: '🔥',
    color: 'from-red-500 to-orange-500',
    category: 'streak',
    reqDescriptionMs: 'Capai rentetan pembelajaran aktif',
    reqDescriptionEn: 'Achieve an active study streak'
  },
  {
    id: 'grand_champion',
    titleMs: 'Adiwira 3M',
    titleEn: '3M Grand Champion',
    descMs: 'Menguasai ketiga-tiga teras Membaca, Menulis, dan Mengira!',
    descEn: 'Mastered all three pillars: Reading, Writing, and Counting!',
    icon: '🏆',
    color: 'from-fuchsia-500 to-purple-600',
    category: 'all',
    reqDescriptionMs: 'Selesaikan sekurang-kurangnya satu modul bagi setiap 3M',
    reqDescriptionEn: 'Complete at least one module from each of 3M'
  }
];
