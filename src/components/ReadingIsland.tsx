import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  Star, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Award,
  Layers,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { Language } from '../types';
import { 
  PHONICS_LIST, 
  SYLLABLES_DATA, 
  READING_QUIZ_DATA, 
  STORY_SENTENCES,
  PhonicsCard,
  SyllableWord
} from '../data/curriculumData';
import { soundService } from '../services/soundService';

interface ReadingIslandProps {
  lang: Language;
  onEarnRewards: (xp: number, stars: number, coins: number, activityType: 'reading') => void;
}

type ReadingSubTab = 'phonics' | 'syllables' | 'quiz' | 'stories';

export const ReadingIsland: React.FC<ReadingIslandProps> = ({ lang, onEarnRewards }) => {
  const [activeTab, setActiveTab] = useState<ReadingSubTab>('phonics');

  // Phonics filter
  const [phonicsFilter, setPhonicsFilter] = useState<'all' | 'vowel' | 'consonant'>('all');
  const [selectedPhonics, setSelectedPhonics] = useState<PhonicsCard>(PHONICS_LIST[0]);

  // Syllable interactive state
  const [activeSyllableIndex, setActiveSyllableIndex] = useState(0);
  const [combinedSyllables, setCombinedSyllables] = useState<string[]>([]);
  const [syllableSuccess, setSyllableSuccess] = useState(false);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Story state
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);

  // Handle Phonics Card Click
  const handlePlayPhonics = (card: PhonicsCard) => {
    setSelectedPhonics(card);
    soundService.playPop();
    const textToSpeak = lang === 'ms' 
      ? `${card.letter}. ${card.phonicsMs}. ${card.wordMs}. ${card.meaningMs}` 
      : `${card.letter}. ${card.phonicsEn}. ${card.wordEn}. ${card.meaningEn}`;
    soundService.speak(textToSpeak, lang);
  };

  // Handle Syllable Click
  const currentSyllableObj = SYLLABLES_DATA[activeSyllableIndex];
  const handleTapSyllable = (syl: string) => {
    soundService.playPop();
    soundService.speak(syl, lang);
    const updated = [...combinedSyllables, syl];
    setCombinedSyllables(updated);

    if (updated.length === currentSyllableObj.syllables.length) {
      const spelled = updated.join('').toLowerCase();
      if (spelled === currentSyllableObj.fullWordMs.toLowerCase()) {
        soundService.playSuccess();
        setSyllableSuccess(true);
        setTimeout(() => {
          soundService.speak(currentSyllableObj.fullWordMs, lang);
        }, 500);
        onEarnRewards(25, 1, 10, 'reading');
      } else {
        soundService.playError();
        setTimeout(() => {
          setCombinedSyllables([]);
        }, 800);
      }
    }
  };

  const handleNextSyllable = () => {
    soundService.playPop();
    setCombinedSyllables([]);
    setSyllableSuccess(false);
    setActiveSyllableIndex((prev) => (prev + 1) % SYLLABLES_DATA.length);
  };

  // Handle Quiz Answer Selection
  const currentQuestion = READING_QUIZ_DATA[quizIndex];
  const handleAnswerQuiz = (option: string) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(option);

    const isCorrect = lang === 'ms' 
      ? option === currentQuestion.correctMs 
      : option === currentQuestion.correctEn;

    if (isCorrect) {
      soundService.playSuccess();
      setQuizScore((prev) => prev + 1);
      soundService.speak(option, lang);
    } else {
      soundService.playError();
    }
  };

  const handleNextQuestion = () => {
    soundService.playPop();
    setSelectedAnswer(null);
    if (quizIndex + 1 < READING_QUIZ_DATA.length) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      soundService.playBadgeUnlocked();
      onEarnRewards(quizScore * 20 + 20, Math.ceil(quizScore / 2), quizScore * 5, 'reading');
    }
  };

  const handleResetQuiz = () => {
    soundService.playPop();
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  // Handle Story Read Aloud
  const currentStory = STORY_SENTENCES[activeStoryIndex];
  const handleReadStoryAloud = () => {
    soundService.playPop();
    const sentence = lang === 'ms' ? currentStory.sentenceMs : currentStory.sentenceEn;
    soundService.speak(sentence, lang);

    // Animate word highlighting
    const words = lang === 'ms' ? currentStory.wordsMs : currentStory.wordsEn;
    words.forEach((_, idx) => {
      setTimeout(() => {
        setHighlightedWordIndex(idx);
      }, idx * 450);
    });

    setTimeout(() => {
      setHighlightedWordIndex(null);
      onEarnRewards(20, 1, 5, 'reading');
    }, words.length * 450 + 500);
  };

  // Filtered phonics cards
  const filteredPhonics = PHONICS_LIST.filter((card) => {
    if (phonicsFilter === 'vowel') return card.category === 'vowel';
    if (phonicsFilter === 'consonant') return card.category === 'consonant';
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Module Title Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-600 p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
            📖
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-1">
              {lang === 'ms' ? 'Modul Membaca 3M' : '3M Reading Module'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              {lang === 'ms' ? 'Pulau Membaca Pintar' : 'Smart Reading Island'}
            </h1>
            <p className="text-xs sm:text-sm text-white/90">
              {lang === 'ms'
                ? 'Terokai sebutan vokal, gabung suku kata KV, teka perkataan bergambar dan baca ayat mudah.'
                : 'Explore phonics, combine syllables, match picture words and practice easy stories.'}
            </p>
          </div>
        </div>

        {/* Sub-Tabs Pills */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-2xl backdrop-blur-md flex-wrap justify-center">
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('phonics');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'phonics' ? 'bg-white text-blue-700 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {lang === 'ms' ? 'Huruf & Fonik' : 'Phonics'}
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('syllables');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'syllables' ? 'bg-white text-blue-700 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {lang === 'ms' ? 'Suku Kata (KV)' : 'Syllables'}
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('quiz');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'quiz' ? 'bg-white text-blue-700 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {lang === 'ms' ? 'Kuiz Teka Gambar' : 'Picture Quiz'}
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('stories');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'stories' ? 'bg-white text-blue-700 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {lang === 'ms' ? 'Bacaan Ayat' : 'Easy Stories'}
          </button>
        </div>
      </div>

      {/* 1. PHONICS SUB-TAB */}
      {activeTab === 'phonics' && (
        <div className="space-y-6">
          {/* Filter options */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'ms' ? 'Tapis Huruf:' : 'Filter Letters:'}
              </span>
              <button
                onClick={() => {
                  soundService.playPop();
                  setPhonicsFilter('all');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  phonicsFilter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'ms' ? 'Semua (A-Z)' : 'All (A-Z)'}
              </button>
              <button
                onClick={() => {
                  soundService.playPop();
                  setPhonicsFilter('vowel');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  phonicsFilter === 'vowel' ? 'bg-rose-500 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'ms' ? 'Vokal (A, E, I, O, U)' : 'Vowels'}
              </button>
              <button
                onClick={() => {
                  soundService.playPop();
                  setPhonicsFilter('consonant');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  phonicsFilter === 'consonant' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'ms' ? 'Konsonan' : 'Consonants'}
              </button>
            </div>
            <div className="text-xs text-slate-500 italic">
              {lang === 'ms' ? '💡 Tekan mana-mana kad untuk mendengar bunyi fonik!' : '💡 Tap any card to hear the phonics voice!'}
            </div>
          </div>

          {/* Detailed Spotlight Card */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-3xl bg-white border-4 border-amber-300 shadow-md flex items-center justify-center text-5xl">
                {selectedPhonics.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black text-amber-700">{selectedPhonics.letter}</span>
                  <span className="text-sm font-extrabold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    {selectedPhonics.category === 'vowel' ? (lang === 'ms' ? 'Huruf Vokal' : 'Vowel') : (lang === 'ms' ? 'Konsonan' : 'Consonant')}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-800 mt-1">
                  {lang === 'ms' ? selectedPhonics.wordMs : selectedPhonics.wordEn}
                </h3>
                <p className="text-xs text-slate-600">
                  {lang === 'ms' ? selectedPhonics.meaningMs : selectedPhonics.meaningEn}
                </p>
                <p className="text-xs font-bold text-amber-800 mt-1">
                  {lang === 'ms' ? `Bunyi Sebutan: "${selectedPhonics.phonicsMs}"` : `Phonics Sound: "${selectedPhonics.phonicsEn}"`}
                </p>
              </div>
            </div>

            <button
              onClick={() => handlePlayPhonics(selectedPhonics)}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>{lang === 'ms' ? 'Dengar Sebutan Suara' : 'Listen to Sound'}</span>
            </button>
          </div>

          {/* Phonics Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {filteredPhonics.map((card) => {
              const isSelected = selectedPhonics.letter === card.letter;
              const isVowel = card.category === 'vowel';
              return (
                <button
                  key={card.letter}
                  onClick={() => handlePlayPhonics(card)}
                  className={`p-3 rounded-2xl text-center border-2 transition-all flex flex-col items-center justify-between group active:scale-95 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-300'
                      : isVowel
                      ? 'border-rose-200 bg-rose-50/50 hover:bg-rose-100 hover:border-rose-400'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-1 group-hover:scale-125 transition-transform">
                    {card.emoji}
                  </div>
                  <div className={`text-2xl font-black ${isVowel ? 'text-rose-600' : 'text-slate-800'}`}>
                    {card.letter}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 truncate w-full">
                    {lang === 'ms' ? card.wordMs : card.wordEn}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. SYLLABLES SUB-TAB */}
      {activeTab === 'syllables' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'ms' ? `Perkataan ${activeSyllableIndex + 1} dari ${SYLLABLES_DATA.length}` : `Word ${activeSyllableIndex + 1} of ${SYLLABLES_DATA.length}`}
              </span>
              <button
                onClick={handleNextSyllable}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>{lang === 'ms' ? 'Seterusnya' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Target Card with Emoji */}
            <div className="py-4">
              <div className="text-6xl sm:text-7xl mb-3 animate-bounce-slow">
                {currentSyllableObj.emoji}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'ms' ? currentSyllableObj.hintMs : currentSyllableObj.hintEn}
              </p>
            </div>

            {/* Syllable Assembly Display */}
            <div className="flex items-center justify-center gap-3">
              {currentSyllableObj.syllables.map((_, idx) => {
                const filled = combinedSyllables[idx];
                return (
                  <div
                    key={idx}
                    className={`w-20 h-16 sm:w-24 sm:h-20 rounded-2xl border-2 flex items-center justify-center text-2xl sm:text-3xl font-black uppercase transition-all ${
                      filled
                        ? 'border-blue-500 bg-blue-100 text-blue-800 shadow-md'
                        : 'border-dashed border-slate-300 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {filled || '?'}
                  </div>
                );
              })}
            </div>

            {/* Success Celebration */}
            {syllableSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 animate-pulse-gentle">
                <div className="flex items-center justify-center gap-2 text-xl font-black">
                  <Sparkles className="w-6 h-6 text-emerald-500" />
                  <span>
                    {lang === 'ms' 
                      ? `Hebat! ${currentSyllableObj.fullWordMs.toUpperCase()}` 
                      : `Awesome! ${currentSyllableObj.fullWordEn.toUpperCase()}`}
                  </span>
                  <Sparkles className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-xs text-emerald-700 mt-1 font-semibold">
                  {lang === 'ms' ? '+25 XP • +1 Bintang diraih!' : '+25 XP • +1 Star earned!'}
                </p>
                <button
                  onClick={handleNextSyllable}
                  className="mt-3 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  {lang === 'ms' ? 'Cuba Perkataan Lain' : 'Try Another Word'}
                </button>
              </div>
            )}

            {/* Available Syllable Options */}
            {!syllableSuccess && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === 'ms' ? 'Tekan Suku Kata Yang Betul:' : 'Tap the Correct Syllable:'}
                </span>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {/* Provide shuffled syllables */}
                  {['ba', 'la', 'ju', 'ro', 'ti', 'bu', 'ku', 'me', 'ja']
                    .filter(s => currentSyllableObj.syllables.includes(s) || Math.random() > 0.4)
                    .slice(0, 4)
                    .map((syl, i) => (
                      <button
                        key={i}
                        onClick={() => handleTapSyllable(syl)}
                        className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-black text-xl shadow-md transition-all"
                      >
                        {syl}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Reset Button */}
            {combinedSyllables.length > 0 && !syllableSuccess && (
              <button
                onClick={() => {
                  soundService.playPop();
                  setCombinedSyllables([]);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ms' ? 'Mula Semula' : 'Reset'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. QUIZ SUB-TAB */}
      {activeTab === 'quiz' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {!quizFinished ? (
            <>
              {/* Question Header & Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>{lang === 'ms' ? `Soalan ${quizIndex + 1} daripada ${READING_QUIZ_DATA.length}` : `Question ${quizIndex + 1} of ${READING_QUIZ_DATA.length}`}</span>
                  <span>{lang === 'ms' ? `Skor: ${quizScore}` : `Score: ${quizScore}`}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${((quizIndex + 1) / READING_QUIZ_DATA.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Quiz Prompt Card */}
              <div className="text-center py-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="text-7xl mb-2">{currentQuestion.emoji}</div>
                <h3 className="text-lg font-black text-blue-950">
                  {lang === 'ms' ? 'Apakah nama objek ini?' : 'What is the name of this object?'}
                </h3>
              </div>

              {/* 4 Multiple Choice Options */}
              <div className="grid grid-cols-2 gap-3">
                {(lang === 'ms' ? currentQuestion.optionsMs : currentQuestion.optionsEn).map((option, idx) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = lang === 'ms' ? option === currentQuestion.correctMs : option === currentQuestion.correctEn;
                  
                  let buttonStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      buttonStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md ring-2 ring-emerald-300';
                    } else if (isSelected) {
                      buttonStyle = 'bg-rose-500 border-rose-600 text-white shadow-md';
                    } else {
                      buttonStyle = 'opacity-50 bg-slate-100 border-slate-200 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleAnswerQuiz(option)}
                      className={`p-4 rounded-2xl border-2 font-black text-base sm:text-lg capitalize transition-all active:scale-95 ${buttonStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Next Question Button */}
              {selectedAnswer !== null && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>
                    {quizIndex + 1 === READING_QUIZ_DATA.length
                      ? (lang === 'ms' ? 'Lihat Keputusan' : 'See Results')
                      : (lang === 'ms' ? 'Soalan Seterusnya' : 'Next Question')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-4xl shadow-inner">
                🏆
              </div>
              <h2 className="text-2xl font-black text-slate-800">
                {lang === 'ms' ? 'Tahniah, Murid Cemerlang!' : 'Congratulations, Great Job!'}
              </h2>
              <p className="text-sm text-slate-600">
                {lang === 'ms' 
                  ? `Anda menjawab ${quizScore} daripada ${READING_QUIZ_DATA.length} soalan dengan betul!` 
                  : `You answered ${quizScore} out of ${READING_QUIZ_DATA.length} questions correctly!`}
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 inline-block font-bold text-xs space-y-1">
                <div>{lang === 'ms' ? `+${quizScore * 20 + 20} Mata Ganjaran XP 🌟` : `+${quizScore * 20 + 20} XP Points 🌟`}</div>
                <div>{lang === 'ms' ? `+${quizScore * 5} Koin Emas 🪙` : `+${quizScore * 5} Gold Coins 🪙`}</div>
              </div>
              <div>
                <button
                  onClick={handleResetQuiz}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all"
                >
                  {lang === 'ms' ? 'Ulang Kuiz Ini' : 'Retry Quiz'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. STORIES SUB-TAB */}
      {activeTab === 'stories' && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'ms' ? `Cerita ${activeStoryIndex + 1} daripada ${STORY_SENTENCES.length}` : `Story ${activeStoryIndex + 1} of ${STORY_SENTENCES.length}`}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={activeStoryIndex === 0}
                onClick={() => {
                  soundService.playPop();
                  setActiveStoryIndex(prev => prev - 1);
                }}
                className="px-3 py-1 rounded-xl bg-slate-100 disabled:opacity-40 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                {lang === 'ms' ? 'Sebelumnya' : 'Prev'}
              </button>
              <button
                disabled={activeStoryIndex === STORY_SENTENCES.length - 1}
                onClick={() => {
                  soundService.playPop();
                  setActiveStoryIndex(prev => prev + 1);
                }}
                className="px-3 py-1 rounded-xl bg-slate-100 disabled:opacity-40 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                {lang === 'ms' ? 'Seterusnya' : 'Next'}
              </button>
            </div>
          </div>

          {/* Story Card */}
          <div className="text-center py-6 bg-gradient-to-b from-sky-50 to-blue-50 rounded-3xl border border-blue-200 space-y-4">
            <div className="text-6xl">{currentStory.emoji}</div>
            <h3 className="text-xl font-black text-blue-900">
              {lang === 'ms' ? currentStory.titleMs : currentStory.titleEn}
            </h3>

            {/* Word by word interactive karaoke text */}
            <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-2">
              {(lang === 'ms' ? currentStory.wordsMs : currentStory.wordsEn).map((word, idx) => {
                const isHighlighted = highlightedWordIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      soundService.playPop();
                      soundService.speak(word, lang);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-lg sm:text-xl font-black transition-all ${
                      isHighlighted
                        ? 'bg-amber-400 text-amber-950 scale-110 shadow-md ring-2 ring-amber-300'
                        : 'bg-white/80 hover:bg-white text-slate-800 border border-slate-200'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {lang === 'ms' ? 'Tekan mana-mana perkataan untuk dengar sebutan individu!' : 'Click any word to hear individual pronunciation!'}
            </p>
          </div>

          {/* Read Aloud Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={handleReadStoryAloud}
              className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-lg transition-all active:scale-95 flex items-center gap-2.5"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>{lang === 'ms' ? 'Baca Bersama Cikgu (Suara)' : 'Read Aloud with Voice'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
