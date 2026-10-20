export interface PhonicsCard {
  letter: string;
  wordMs: string;
  wordEn: string;
  meaningMs: string;
  meaningEn: string;
  emoji: string;
  category: 'vowel' | 'consonant';
  phonicsMs: string;
  phonicsEn: string;
}

export interface SyllableWord {
  syllables: string[];
  fullWordMs: string;
  fullWordEn: string;
  emoji: string;
  hintMs: string;
  hintEn: string;
}

export interface ReadingQuestion {
  id: string;
  emoji: string;
  wordMs: string;
  wordEn: string;
  optionsMs: string[];
  optionsEn: string[];
  correctMs: string;
  correctEn: string;
}

export interface StorySentence {
  id: string;
  titleMs: string;
  titleEn: string;
  emoji: string;
  sentenceMs: string;
  sentenceEn: string;
  wordsMs: string[];
  wordsEn: string[];
}

export interface WordScrambleTask {
  id: string;
  wordMs: string;
  wordEn: string;
  emoji: string;
  lettersMs: string[];
  lettersEn: string[];
  hintMs: string;
  hintEn: string;
}

export interface MissingLetterTask {
  id: string;
  emoji: string;
  displayWordMs: string;
  displayWordEn: string;
  correctLetterMs: string;
  correctLetterEn: string;
  optionsMs: string[];
  optionsEn: string[];
}

export interface TraceLetterTemplate {
  char: string;
  category: 'vowel' | 'consonant' | 'number';
  display: string;
  strokeHintMs: string;
  strokeHintEn: string;
  sampleWordMs: string;
  sampleWordEn: string;
  emoji: string;
}

export const PHONICS_LIST: PhonicsCard[] = [
  { letter: 'A', wordMs: 'Ayam', wordEn: 'Apple', meaningMs: 'Ayam berkokok', meaningEn: 'Red sweet apple', emoji: '🐔', category: 'vowel', phonicsMs: 'Aa... Ayam', phonicsEn: 'Aa... Apple' },
  { letter: 'E', wordMs: 'Epal', wordEn: 'Elephant', meaningMs: 'Epal merah manis', meaningEn: 'Big gray elephant', emoji: '🍎', category: 'vowel', phonicsMs: 'Ee... Epal', phonicsEn: 'Ee... Elephant' },
  { letter: 'I', wordMs: 'Ikan', wordEn: 'Iguana', meaningMs: 'Ikan berenang laju', meaningEn: 'Green iguana lizard', emoji: '🐟', category: 'vowel', phonicsMs: 'Ii... Ikan', phonicsEn: 'Ii... Iguana' },
  { letter: 'O', wordMs: 'Oren', wordEn: 'Orange', meaningMs: 'Oren bulat sedap', meaningEn: 'Juicy orange fruit', emoji: '🍊', category: 'vowel', phonicsMs: 'Oo... Oren', phonicsEn: 'Oo... Orange' },
  { letter: 'U', wordMs: 'Udang', wordEn: 'Umbrella', meaningMs: 'Udang laut segar', meaningEn: 'Rainy day umbrella', emoji: '🦐', category: 'vowel', phonicsMs: 'Uu... Udang', phonicsEn: 'Uu... Umbrella' },
  { letter: 'B', wordMs: 'Bola', wordEn: 'Ball', meaningMs: 'Bola bulat sepak', meaningEn: 'Bouncing soccer ball', emoji: '⚽', category: 'consonant', phonicsMs: 'Beh... Bola', phonicsEn: 'Buh... Ball' },
  { letter: 'C', wordMs: 'Cawan', wordEn: 'Cat', meaningMs: 'Cawan air teh', meaningEn: 'Cute playful cat', emoji: '☕', category: 'consonant', phonicsMs: 'Ceh... Cawan', phonicsEn: 'Cuh... Cat' },
  { letter: 'D', wordMs: 'Dadu', wordEn: 'Duck', meaningMs: 'Dadu nombor bertuah', meaningEn: 'Yellow swimming duck', emoji: '🎲', category: 'consonant', phonicsMs: 'Deh... Dadu', phonicsEn: 'Duh... Duck' },
  { letter: 'G', wordMs: 'Gajah', wordEn: 'Guitar', meaningMs: 'Gajah belalai panjang', meaningEn: 'Acoustic wooden guitar', emoji: '🐘', category: 'consonant', phonicsMs: 'Geh... Gajah', phonicsEn: 'Guh... Guitar' },
  { letter: 'K', wordMs: 'Kereta', wordEn: 'Kite', meaningMs: 'Kereta laju di jalan', meaningEn: 'Flying windy kite', emoji: '🚗', category: 'consonant', phonicsMs: 'Keh... Kereta', phonicsEn: 'Kuh... Kite' },
  { letter: 'M', wordMs: 'Mata', wordEn: 'Moon', meaningMs: 'Mata untuk melihat', meaningEn: 'Bright night moon', emoji: '👁️', category: 'consonant', phonicsMs: 'Em... Mata', phonicsEn: 'Mmm... Moon' },
  { letter: 'N', wordMs: 'Nanas', wordEn: 'Nest', meaningMs: 'Nanas manis masam', meaningEn: 'Cozy bird nest', emoji: '🍍', category: 'consonant', phonicsMs: 'En... Nanas', phonicsEn: 'Nnn... Nest' },
  { letter: 'P', wordMs: 'Pokok', wordEn: 'Pencil', meaningMs: 'Pokok hijau redup', meaningEn: 'Sharp writing pencil', emoji: '🌳', category: 'consonant', phonicsMs: 'Peh... Pokok', phonicsEn: 'Puh... Pencil' },
  { letter: 'R', wordMs: 'Roti', wordEn: 'Rainbow', meaningMs: 'Roti bakar enak', meaningEn: 'Colorful rainbow arc', emoji: '🍞', category: 'consonant', phonicsMs: 'Er... Roti', phonicsEn: 'Rrr... Rainbow' },
  { letter: 'S', wordMs: 'Susu', wordEn: 'Sun', meaningMs: 'Susu berkhasiat sihat', meaningEn: 'Shining golden sun', emoji: '🥛', category: 'consonant', phonicsMs: 'Es... Susu', phonicsEn: 'Sss... Sun' },
  { letter: 'T', wordMs: 'Topi', wordEn: 'Tiger', meaningMs: 'Topi cantik pelindung', meaningEn: 'Strong striped tiger', emoji: '🧢', category: 'consonant', phonicsMs: 'Teh... Topi', phonicsEn: 'Tuh... Tiger' },
];

export const SYLLABLES_DATA: SyllableWord[] = [
  { syllables: ['ba', 'ju'], fullWordMs: 'baju', fullWordEn: 'shirt', emoji: '👕', hintMs: 'Pakaian dipakai di badan', hintEn: 'Clothing worn on body' },
  { syllables: ['bo', 'la'], fullWordMs: 'bola', fullWordEn: 'ball', emoji: '⚽', hintMs: 'Alat mainan bulat disepak', hintEn: 'Round toy to kick' },
  { syllables: ['ro', 'ti'], fullWordMs: 'roti', fullWordEn: 'bread', emoji: '🍞', hintMs: 'Makanan sarapan sedap', hintEn: 'Yummy breakfast food' },
  { syllables: ['bu', 'ku'], fullWordMs: 'buku', fullWordEn: 'book', emoji: '📖', hintMs: 'Bahan untuk dibaca murid', hintEn: 'Item to read and learn' },
  { syllables: ['me', 'ja'], fullWordMs: 'meja', fullWordEn: 'table', emoji: '🪑', hintMs: 'Perabot meletakkan buku', hintEn: 'Furniture for studying' },
  { syllables: ['ka', 'ki'], fullWordMs: 'kaki', fullWordEn: 'leg', emoji: '🦵', hintMs: 'Anggota badan untuk berjalan', hintEn: 'Body part for walking' },
  { syllables: ['ce', 'ri'], fullWordMs: 'ceri', fullWordEn: 'cherry', emoji: '🍒', hintMs: 'Buah kecil manis merah', hintEn: 'Small sweet red fruit' },
  { syllables: ['su', 'du'], fullWordMs: 'sudu', fullWordEn: 'spoon', emoji: '🥄', hintMs: 'Alat menyuap sup nasi', hintEn: 'Cutlery for eating soup' },
  { syllables: ['gi', 'gi'], fullWordMs: 'gigi', fullWordEn: 'teeth', emoji: '🦷', hintMs: 'Gigi putih bersih disengih', hintEn: 'Clean shiny white teeth' },
  { syllables: ['ko', 'pi'], fullWordMs: 'kopi', fullWordEn: 'coffee', emoji: '☕', hintMs: 'Minuman wangi waktu pagi', hintEn: 'Warm morning drink' },
];

export const READING_QUIZ_DATA: ReadingQuestion[] = [
  {
    id: 'rq1',
    emoji: '🚗',
    wordMs: 'kereta',
    wordEn: 'car',
    optionsMs: ['kereta', 'kapal', 'kerusi', 'kelapa'],
    optionsEn: ['car', 'boat', 'chair', 'coconut'],
    correctMs: 'kereta',
    correctEn: 'car'
  },
  {
    id: 'rq2',
    emoji: '🐱',
    wordMs: 'kucing',
    wordEn: 'cat',
    optionsMs: ['anjing', 'kucing', 'kambing', 'kuda'],
    optionsEn: ['dog', 'cat', 'goat', 'horse'],
    correctMs: 'kucing',
    correctEn: 'cat'
  },
  {
    id: 'rq3',
    emoji: '🍎',
    wordMs: 'epal',
    wordEn: 'apple',
    optionsMs: ['oren', 'pisang', 'epal', 'tembikai'],
    optionsEn: ['orange', 'banana', 'apple', 'watermelon'],
    correctMs: 'epal',
    correctEn: 'apple'
  },
  {
    id: 'rq4',
    emoji: '🏠',
    wordMs: 'rumah',
    wordEn: 'house',
    optionsMs: ['rumah', 'sekolah', 'taman', 'kedai'],
    optionsEn: ['house', 'school', 'park', 'shop'],
    correctMs: 'rumah',
    correctEn: 'house'
  },
  {
    id: 'rq5',
    emoji: '🌸',
    wordMs: 'bunga',
    wordEn: 'flower',
    optionsMs: ['daun', 'pokok', 'bunga', 'ranting'],
    optionsEn: ['leaf', 'tree', 'flower', 'branch'],
    correctMs: 'bunga',
    correctEn: 'flower'
  }
];

export const STORY_SENTENCES: StorySentence[] = [
  {
    id: 's1',
    titleMs: 'Buku Baharu Ali',
    titleEn: 'Ali\'s New Book',
    emoji: '📚',
    sentenceMs: 'Ini buku saya. Buku saya berwarna biru dan bersih.',
    sentenceEn: 'This is my book. My book is blue and clean.',
    wordsMs: ['Ini', 'buku', 'saya', 'berwarna', 'biru', 'dan', 'bersih'],
    wordsEn: ['This', 'is', 'my', 'book', 'blue', 'and', 'clean']
  },
  {
    id: 's2',
    titleMs: 'Kucing Comel Siti',
    titleEn: 'Siti\'s Cute Cat',
    emoji: '🐱',
    sentenceMs: 'Kucing ini sangat comel. Si Tompok suka minum susu segar.',
    sentenceEn: 'This cat is very cute. Tompok loves drinking fresh milk.',
    wordsMs: ['Kucing', 'ini', 'sangat', 'comel', 'suka', 'minum', 'susu'],
    wordsEn: ['This', 'cat', 'is', 'very', 'cute', 'drinks', 'milk']
  },
  {
    id: 's3',
    titleMs: 'Hari Sukan Sekolah',
    titleEn: 'School Sports Day',
    emoji: '🏃‍♂️',
    sentenceMs: 'Murid berlari pantas di padang sekolah dengan riang gembira.',
    sentenceEn: 'Students run swiftly on the school field happily.',
    wordsMs: ['Murid', 'berlari', 'pantas', 'di', 'padang', 'sekolah'],
    wordsEn: ['Students', 'run', 'swiftly', 'on', 'the', 'field']
  }
];

export const TRACE_TEMPLATES: TraceLetterTemplate[] = [
  { char: 'A', category: 'vowel', display: 'A', strokeHintMs: 'Tarik condong kiri, condong kanan, garis tengah.', strokeHintEn: 'Slant left, slant right, cross middle.', sampleWordMs: 'Ayam', sampleWordEn: 'Apple', emoji: '🍎' },
  { char: 'a', category: 'vowel', display: 'a', strokeHintMs: 'Buat bulatan separuh, tarik garis tiang turun ke bawah.', strokeHintEn: 'Curve round, then stroke down straight.', sampleWordMs: 'awan', sampleWordEn: 'ant', emoji: '☁️' },
  { char: 'B', category: 'consonant', display: 'B', strokeHintMs: 'Garis tegak turun, lengkung atas, lengkung bawah.', strokeHintEn: 'Straight down, curve top, curve bottom.', sampleWordMs: 'Bola', sampleWordEn: 'Ball', emoji: '⚽' },
  { char: 'b', category: 'consonant', display: 'b', strokeHintMs: 'Tiang tegak panjang, buat perut bulat di bawah.', strokeHintEn: 'Long straight stick down, round tummy at bottom.', sampleWordMs: 'baju', sampleWordEn: 'bear', emoji: '👕' },
  { char: 'C', category: 'consonant', display: 'C', strokeHintMs: 'Lengkung bulan sabit dari atas pusing ke bawah.', strokeHintEn: 'Curve around like a crescent moon.', sampleWordMs: 'Cawan', sampleWordEn: 'Cat', emoji: '☕' },
  { char: 'D', category: 'consonant', display: 'D', strokeHintMs: 'Tiang tegak turun, perut besar melengkung ke kanan.', strokeHintEn: 'Straight down, big curve to the right.', sampleWordMs: 'Dadu', sampleWordEn: 'Duck', emoji: '🎲' },
  { char: 'E', category: 'vowel', display: 'E', strokeHintMs: 'Tiang tegak, sikat atas, sikat tengah, sikat bawah.', strokeHintEn: 'Straight down, three horizontal bars.', sampleWordMs: 'Epal', sampleWordEn: 'Elephant', emoji: '🐘' },
  { char: '1', category: 'number', display: '1', strokeHintMs: 'Serong sedikit ke atas, tarik tegak turun ke bawah.', strokeHintEn: 'Slant up a bit, straight line down.', sampleWordMs: 'Satu', sampleWordEn: 'One', emoji: '🥇' },
  { char: '2', category: 'number', display: '2', strokeHintMs: 'Lengkung leher angsa, condong turun, garis lurus alas.', strokeHintEn: 'Curve like swan neck, slide down, flat line.', sampleWordMs: 'Dua', sampleWordEn: 'Two', emoji: '✌️' },
  { char: '3', category: 'number', display: '3', strokeHintMs: 'Lengkung atas, lengkung bawah seperti sayap rama-rama.', strokeHintEn: 'Curve in, curve around like butterfly wings.', sampleWordMs: 'Tiga', sampleWordEn: 'Three', emoji: '🥉' },
  { char: '5', category: 'number', display: '5', strokeHintMs: 'Tolak kiri, turun tegak pendek, buat perut buncit.', strokeHintEn: 'Stroke back, straight down, big round tummy.', sampleWordMs: 'Lima', sampleWordEn: 'Five', emoji: '🖐️' },
  { char: '8', category: 'number', display: '8', strokeHintMs: 'Pusing huruf S, naik pusing tutup balik.', strokeHintEn: 'Make an S shape, cross back up to close.', sampleWordMs: 'Lapan', sampleWordEn: 'Eight', emoji: '🎱' },
];

export const WORD_SCRAMBLE_LIST: WordScrambleTask[] = [
  { id: 'w1', wordMs: 'BAJU', wordEn: 'SHIRT', emoji: '👕', lettersMs: ['J', 'B', 'U', 'A'], lettersEn: ['H', 'S', 'T', 'I', 'R'], hintMs: 'Pakaian harian kita', hintEn: 'Everyday clothing' },
  { id: 'w2', wordMs: 'BUKU', wordEn: 'BOOK', emoji: '📖', lettersMs: ['K', 'B', 'U', 'U'], lettersEn: ['K', 'B', 'O', 'O'], hintMs: 'Membaca jambatan ilmu', hintEn: 'Pages of stories and knowledge' },
  { id: 'w3', wordMs: 'BOLA', wordEn: 'BALL', emoji: '⚽', lettersMs: ['L', 'A', 'B', 'O'], lettersEn: ['L', 'B', 'L', 'A'], hintMs: 'Disepak ke dalam gol', hintEn: 'Kick it into the goal' },
  { id: 'w4', wordMs: 'ROTI', wordEn: 'BREAD', emoji: '🍞', lettersMs: ['T', 'R', 'I', 'O'], lettersEn: ['E', 'B', 'A', 'R', 'D'], hintMs: 'Sedap disapu jem kaya', hintEn: 'Tasty with butter or jam' },
  { id: 'w5', wordMs: 'IKAN', wordEn: 'FISH', emoji: '🐟', lettersMs: ['N', 'I', 'A', 'K'], lettersEn: ['S', 'F', 'H', 'I'], hintMs: 'Berenang di dalam air', hintEn: 'Swims in rivers and oceans' },
];

export const MISSING_LETTER_LIST: MissingLetterTask[] = [
  { id: 'm1', emoji: '👕', displayWordMs: 'B _ J U', displayWordEn: 'S H _ R T', correctLetterMs: 'A', correctLetterEn: 'I', optionsMs: ['A', 'E', 'O'], optionsEn: ['I', 'A', 'E'] },
  { id: 'm2', emoji: '🍞', displayWordMs: 'R O T _', displayWordEn: 'B R E _ D', correctLetterMs: 'I', correctLetterEn: 'A', optionsMs: ['I', 'U', 'O'], optionsEn: ['A', 'O', 'U'] },
  { id: 'm3', emoji: '📖', displayWordMs: 'B _ K U', displayWordEn: 'B O _ K', correctLetterMs: 'U', correctLetterEn: 'O', optionsMs: ['U', 'A', 'I'], optionsEn: ['O', 'E', 'I'] },
  { id: 'm4', emoji: '⚽', displayWordMs: 'B O L _', displayWordEn: 'B _ L L', correctLetterMs: 'A', correctLetterEn: 'A', optionsMs: ['A', 'I', 'E'], optionsEn: ['A', 'E', 'U'] },
  { id: 'm5', emoji: '🐟', displayWordMs: 'I K _ N', displayWordEn: 'F I S _', correctLetterMs: 'A', correctLetterEn: 'H', optionsMs: ['A', 'U', 'O'], optionsEn: ['H', 'K', 'T'] },
];

export const COUNT_OBJECTS_DATA = [
  { count: 3, itemEmoji: '🍎', nameMs: 'Epal', nameEn: 'Apples' },
  { count: 5, itemEmoji: '⭐', nameMs: 'Bintang', nameEn: 'Stars' },
  { count: 7, itemEmoji: '🚗', nameMs: 'Kereta', nameEn: 'Cars' },
  { count: 4, itemEmoji: '🐰', nameMs: 'Arnab', nameEn: 'Bunnies' },
  { count: 6, itemEmoji: '🎈', nameMs: 'Belon', nameEn: 'Balloons' },
  { count: 8, itemEmoji: '🌸', nameMs: 'Bunga', nameEn: 'Flowers' },
  { count: 10, itemEmoji: '🐟', nameMs: 'Ikan', nameEn: 'Fish' },
];
