import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Star, 
  Flame, 
  Timer, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  Trophy,
  Volume2
} from 'lucide-react';
import { Language } from '../types';
import { COUNT_OBJECTS_DATA } from '../data/curriculumData';
import { soundService } from '../services/soundService';

interface MathIslandProps {
  lang: Language;
  onEarnRewards: (xp: number, stars: number, coins: number, activityType: 'math', speedScore?: number) => void;
  bestSpeedScore: number;
}

type MathSubTab = 'count' | 'addition' | 'subtraction' | 'speed';

export const MathIsland: React.FC<MathIslandProps> = ({ 
  lang, 
  onEarnRewards,
  bestSpeedScore
}) => {
  const [activeTab, setActiveTab] = useState<MathSubTab>('count');

  // Interactive Counting State
  const [countIndex, setCountIndex] = useState(0);
  const currentCountData = COUNT_OBJECTS_DATA[countIndex];
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [countConfirmed, setCountConfirmed] = useState(false);

  // Addition State
  const [addQuestion, setAddQuestion] = useState({ a: 3, b: 2, emoji: '🍎' });
  const [addAnswerSelected, setAddAnswerSelected] = useState<number | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  // Subtraction State
  const [subQuestion, setSubQuestion] = useState({ total: 5, minus: 2, emoji: '🎈' });
  const [subAnswerSelected, setSubAnswerSelected] = useState<number | null>(null);
  const [subSuccess, setSubSuccess] = useState(false);

  // 60-Second Speed Math Blitz State
  const [speedActive, setSpeedActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedCombo, setSpeedCombo] = useState(0);
  const [speedQuiz, setSpeedQuiz] = useState({ text: '2 + 3 = ?', answer: 5, options: [4, 5, 6, 7] });
  const [speedFinished, setSpeedFinished] = useState(false);

  // Tap Counting Handlers
  const handleTapObject = (idx: number) => {
    if (tappedIndices.includes(idx) || countConfirmed) return;
    const updated = [...tappedIndices, idx];
    setTappedIndices(updated);
    soundService.playPop();

    const currentCount = updated.length;
    soundService.speak(String(currentCount), lang);

    if (currentCount === currentCountData.count) {
      soundService.playSuccess();
      setCountConfirmed(true);
      onEarnRewards(25, 1, 10, 'math');
    }
  };

  const handleNextCount = () => {
    soundService.playPop();
    setTappedIndices([]);
    setCountConfirmed(false);
    setCountIndex((prev) => (prev + 1) % COUNT_OBJECTS_DATA.length);
  };

  // Addition Logic
  const generateNewAddition = () => {
    const emojis = ['🍎', '⭐', '🚗', '🍓', '🧁', '⚽'];
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    setAddQuestion({ a, b, emoji });
    setAddAnswerSelected(null);
    setAddSuccess(false);
  };

  const handleSelectAddAnswer = (ans: number) => {
    if (addAnswerSelected !== null) return;
    setAddAnswerSelected(ans);

    const correct = addQuestion.a + addQuestion.b;
    if (ans === correct) {
      soundService.playSuccess();
      setAddSuccess(true);
      onEarnRewards(25, 1, 10, 'math');
      soundService.speak(lang === 'ms' ? `${addQuestion.a} tambah ${addQuestion.b} bersamaan ${correct}` : `${addQuestion.a} plus ${addQuestion.b} equals ${correct}`, lang);
    } else {
      soundService.playError();
    }
  };

  // Subtraction Logic
  const generateNewSubtraction = () => {
    const emojis = ['🎈', '🍪', '🐟', '🍬', '🍦'];
    const total = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const minus = Math.floor(Math.random() * (total - 1)) + 1; // 1 to total-1
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    setSubQuestion({ total, minus, emoji });
    setSubAnswerSelected(null);
    setSubSuccess(false);
  };

  const handleSelectSubAnswer = (ans: number) => {
    if (subAnswerSelected !== null) return;
    setSubAnswerSelected(ans);

    const correct = subQuestion.total - subQuestion.minus;
    if (ans === correct) {
      soundService.playSuccess();
      setSubSuccess(true);
      onEarnRewards(25, 1, 10, 'math');
      soundService.speak(lang === 'ms' ? `${subQuestion.total} tolak ${subQuestion.minus} tinggal ${correct}` : `${subQuestion.total} minus ${subQuestion.minus} is ${correct}`, lang);
    } else {
      soundService.playError();
    }
  };

  // Speed Math Blitz Logic
  const generateSpeedQuestion = () => {
    const isPlus = Math.random() > 0.4;
    let a = Math.floor(Math.random() * 9) + 1;
    let b = Math.floor(Math.random() * 8) + 1;
    let answer = 0;
    let text = '';

    if (isPlus) {
      answer = a + b;
      text = `${a} + ${b} = ?`;
    } else {
      if (a < b) [a, b] = [b, a];
      answer = a - b;
      text = `${a} - ${b} = ?`;
    }

    // Generate 4 options
    const optionsSet = new Set<number>([answer]);
    while (optionsSet.size < 4) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 1);
      const opt = Math.max(0, answer + delta);
      optionsSet.add(opt);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    setSpeedQuiz({ text, answer, options });
  };

  const startSpeedMath = () => {
    soundService.playPop();
    setSpeedScore(0);
    setSpeedCombo(0);
    setTimeLeft(60);
    setSpeedFinished(false);
    setSpeedActive(true);
    generateSpeedQuestion();
  };

  useEffect(() => {
    let timer: any = null;
    if (speedActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSpeedActive(false);
            setSpeedFinished(true);
            soundService.playBadgeUnlocked();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [speedActive, timeLeft]);

  const handleAnswerSpeedQuiz = (ans: number) => {
    if (!speedActive) return;

    if (ans === speedQuiz.answer) {
      soundService.playSuccess();
      const newCombo = speedCombo + 1;
      const points = 1 + (newCombo > 2 ? 1 : 0);
      setSpeedScore((prev) => prev + points);
      setSpeedCombo(newCombo);
    } else {
      soundService.playError();
      setSpeedCombo(0);
    }

    generateSpeedQuestion();
  };

  // When speed sprint ends, grant rewards
  useEffect(() => {
    if (speedFinished && speedScore > 0) {
      onEarnRewards(speedScore * 15, Math.ceil(speedScore / 3), speedScore * 5, 'math', speedScore);
    }
  }, [speedFinished]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Module Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
            🔢
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-1">
              {lang === 'ms' ? 'Modul Mengira 3M' : '3M Math Module'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              {lang === 'ms' ? 'Pulau Mengira Ceria' : 'Fun Math Island'}
            </h1>
            <p className="text-xs sm:text-sm text-white/90">
              {lang === 'ms'
                ? 'Kira objek interaktif, kuasai tambah dan tolak visual, serta sahut cabaran 60 saat.'
                : 'Count interactive objects, master visual plus and minus, and take on the 60s speed sprint.'}
            </p>
          </div>
        </div>

        {/* Sub-Tabs Pills */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-2xl backdrop-blur-md flex-wrap justify-center">
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('count');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'count' ? 'bg-white text-amber-700 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {lang === 'ms' ? 'Kira Objek (1-20)' : 'Counting (1-20)'}
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('addition');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'addition' ? 'bg-white text-amber-700 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {lang === 'ms' ? 'Tambah Visual' : 'Addition'}
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('subtraction');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'subtraction' ? 'bg-white text-amber-700 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {lang === 'ms' ? 'Tolak Seronok' : 'Subtraction'}
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('speed');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'speed' ? 'bg-white text-amber-700 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {lang === 'ms' ? 'Kilat 60 Saat' : '60s Sprint'}
          </button>
        </div>
      </div>

      {/* 1. TACTILE COUNTING SUB-TAB */}
      {activeTab === 'count' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'ms' ? `Latihan ${countIndex + 1} daripada ${COUNT_OBJECTS_DATA.length}` : `Exercise ${countIndex + 1} of ${COUNT_OBJECTS_DATA.length}`}
            </span>
            <button
              onClick={handleNextCount}
              className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1"
            >
              <span>{lang === 'ms' ? 'Objek Lain' : 'Next Item'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-800">
              {lang === 'ms' ? `Kira berapa ${currentCountData.nameMs} yang ada!` : `Count how many ${currentCountData.nameEn} there are!`}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'ms' ? 'Tekan setiap objek satu persatu dengan jari atau tetikus!' : 'Tap each object one by one with your finger or mouse!'}
            </p>
          </div>

          {/* Scattered interactive objects grid */}
          <div className="p-6 rounded-3xl bg-amber-50/60 border-2 border-amber-200 min-h-[220px] flex items-center justify-center flex-wrap gap-4 sm:gap-6">
            {Array.from({ length: currentCountData.count }).map((_, idx) => {
              const isTapped = tappedIndices.includes(idx);
              const tapOrder = tappedIndices.indexOf(idx) + 1;

              return (
                <button
                  key={idx}
                  onClick={() => handleTapObject(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl transition-all transform active:scale-90 ${
                    isTapped
                      ? 'bg-amber-300 border-2 border-amber-500 shadow-md scale-105'
                      : 'bg-white hover:bg-amber-100 border-2 border-amber-200 shadow-xs'
                  }`}
                >
                  <span>{currentCountData.itemEmoji}</span>
                  {isTapped && (
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-rose-500 text-white font-black text-sm flex items-center justify-center shadow-md animate-bounce-slow">
                      {tapOrder}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress / Completion Status */}
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-bold text-slate-600">
              {lang === 'ms' ? 'Dikira:' : 'Counted:'} <span className="text-amber-600 text-lg font-black">{tappedIndices.length}</span> / {currentCountData.count}
            </span>

            {countConfirmed && (
              <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold text-sm">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>{lang === 'ms' ? 'Tepat! Semua sudah dikira!' : 'Spot on! All counted!'}</span>
              </div>
            )}
          </div>

          {countConfirmed && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 animate-pulse-gentle">
              <span className="font-extrabold text-sm block">
                {lang === 'ms' ? `Hebat! Jumlahnya ialah ${currentCountData.count}! +25 XP diraih!` : `Great job! Total is ${currentCountData.count}! +25 XP earned!`}
              </span>
              <button
                onClick={handleNextCount}
                className="mt-3 px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                {lang === 'ms' ? 'Kira Objek Seterusnya' : 'Count Next Item'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. VISUAL ADDITION SUB-TAB */}
      {activeTab === 'addition' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'ms' ? 'Operasi Tambah (+)' : 'Addition Operation (+)'}
            </span>
            <button
              onClick={() => {
                soundService.playPop();
                generateNewAddition();
              }}
              className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ms' ? 'Soalan Baharu' : 'New Question'}</span>
            </button>
          </div>

          {/* Visual Equation Container */}
          <div className="p-6 rounded-3xl bg-amber-50/70 border-2 border-amber-200 flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
            {/* Group A */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-[140px] bg-white p-3 rounded-2xl border border-amber-200 shadow-xs min-h-[70px]">
                {Array.from({ length: addQuestion.a }).map((_, i) => (
                  <span key={i} className="text-2xl sm:text-3xl animate-bounce-slow">{addQuestion.emoji}</span>
                ))}
              </div>
              <span className="text-3xl font-black text-amber-700 mt-2">{addQuestion.a}</span>
            </div>

            {/* Plus Sign */}
            <div className="text-4xl font-black text-amber-600">+</div>

            {/* Group B */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-[140px] bg-white p-3 rounded-2xl border border-amber-200 shadow-xs min-h-[70px]">
                {Array.from({ length: addQuestion.b }).map((_, i) => (
                  <span key={i} className="text-2xl sm:text-3xl animate-bounce-slow">{addQuestion.emoji}</span>
                ))}
              </div>
              <span className="text-3xl font-black text-amber-700 mt-2">{addQuestion.b}</span>
            </div>

            {/* Equals Sign */}
            <div className="text-4xl font-black text-amber-600">=</div>

            {/* Question Mark Box */}
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl border-2 border-dashed border-amber-400 bg-white flex items-center justify-center text-3xl font-black text-amber-600 shadow-xs">
              {addAnswerSelected !== null ? addAnswerSelected : '?'}
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {lang === 'ms' ? 'Pilih Jawapan Yang Betul:' : 'Select the Correct Answer:'}
            </span>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {[
                addQuestion.a + addQuestion.b - 1,
                addQuestion.a + addQuestion.b,
                addQuestion.a + addQuestion.b + 1,
                addQuestion.a + addQuestion.b + 2
              ]
                .filter((val, i, arr) => val > 0 && arr.indexOf(val) === i)
                .slice(0, 4)
                .sort(() => Math.random() - 0.5)
                .map((ans, idx) => {
                  const isSelected = addAnswerSelected === ans;
                  const isCorrect = ans === addQuestion.a + addQuestion.b;

                  let style = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
                  if (addAnswerSelected !== null) {
                    if (isCorrect) style = 'bg-emerald-500 border-emerald-600 text-white shadow-md';
                    else if (isSelected) style = 'bg-rose-500 border-rose-600 text-white';
                    else style = 'opacity-40 bg-slate-100 text-slate-400 border-slate-200';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={addAnswerSelected !== null}
                      onClick={() => handleSelectAddAnswer(ans)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 font-black text-3xl shadow-xs transition-all active:scale-95 ${style}`}
                    >
                      {ans}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Success Banner */}
          {addSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 animate-pulse-gentle">
              <span className="font-extrabold text-sm block">
                {lang === 'ms' 
                  ? `Betul! ${addQuestion.a} + ${addQuestion.b} = ${addQuestion.a + addQuestion.b}! +25 XP!` 
                  : `Correct! ${addQuestion.a} + ${addQuestion.b} = ${addQuestion.a + addQuestion.b}! +25 XP!`}
              </span>
              <button
                onClick={generateNewAddition}
                className="mt-3 px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                {lang === 'ms' ? 'Soalan Seterusnya' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. VISUAL SUBTRACTION SUB-TAB */}
      {activeTab === 'subtraction' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'ms' ? 'Operasi Tolak (-)' : 'Subtraction Operation (-)'}
            </span>
            <button
              onClick={() => {
                soundService.playPop();
                generateNewSubtraction();
              }}
              className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ms' ? 'Soalan Baharu' : 'New Question'}</span>
            </button>
          </div>

          {/* Visual Subtraction Display */}
          <div className="p-6 rounded-3xl bg-blue-50/70 border-2 border-blue-200 space-y-4">
            <div className="text-3xl font-black text-blue-950">
              {subQuestion.total} - {subQuestion.minus} = ?
            </div>

            <p className="text-xs text-slate-600">
              {lang === 'ms' 
                ? `Mula dengan ${subQuestion.total} ${subQuestion.emoji}, tolak ${subQuestion.minus} (dipalang ❌). Berapa baki yang tinggal?` 
                : `Start with ${subQuestion.total} ${subQuestion.emoji}, take away ${subQuestion.minus} (crossed out ❌). How many are left?`}
            </p>

            {/* Visual Items with Cross-out effect */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap py-2">
              {Array.from({ length: subQuestion.total }).map((_, idx) => {
                const isCrossed = idx >= subQuestion.total - subQuestion.minus;
                return (
                  <div
                    key={idx}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all ${
                      isCrossed
                        ? 'bg-rose-100 border-2 border-rose-300 opacity-40'
                        : 'bg-white border-2 border-blue-200 shadow-xs'
                    }`}
                  >
                    <span>{subQuestion.emoji}</span>
                    {isCrossed && (
                      <span className="absolute inset-0 flex items-center justify-center text-rose-600 font-black text-2xl">
                        ✖
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {lang === 'ms' ? 'Pilih Baki Yang Tinggal:' : 'Select Remaining Count:'}
            </span>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {[
                subQuestion.total - subQuestion.minus - 1,
                subQuestion.total - subQuestion.minus,
                subQuestion.total - subQuestion.minus + 1,
                subQuestion.total - subQuestion.minus + 2
              ]
                .filter((v, i, arr) => v >= 0 && arr.indexOf(v) === i)
                .slice(0, 4)
                .sort(() => Math.random() - 0.5)
                .map((ans, idx) => {
                  const isSelected = subAnswerSelected === ans;
                  const isCorrect = ans === subQuestion.total - subQuestion.minus;

                  let style = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
                  if (subAnswerSelected !== null) {
                    if (isCorrect) style = 'bg-emerald-500 border-emerald-600 text-white shadow-md';
                    else if (isSelected) style = 'bg-rose-500 border-rose-600 text-white';
                    else style = 'opacity-40 bg-slate-100 text-slate-400 border-slate-200';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={subAnswerSelected !== null}
                      onClick={() => handleSelectSubAnswer(ans)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 font-black text-3xl shadow-xs transition-all active:scale-95 ${style}`}
                    >
                      {ans}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Subtraction Success */}
          {subSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 animate-pulse-gentle">
              <span className="font-extrabold text-sm block">
                {lang === 'ms' 
                  ? `Tahniah! Baki yang tinggal ialah ${subQuestion.total - subQuestion.minus}! +25 XP!` 
                  : `Well done! The remaining balance is ${subQuestion.total - subQuestion.minus}! +25 XP!`}
              </span>
              <button
                onClick={generateNewSubtraction}
                className="mt-3 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                {lang === 'ms' ? 'Soalan Seterusnya' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. SPEED MATH 60s BLITZ */}
      {activeTab === 'speed' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
          {!speedActive && !speedFinished ? (
            /* Intro / Ready Screen */
            <div className="py-6 space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-4xl shadow-inner">
                ⚡
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">
                  {lang === 'ms' ? 'Cabaran Kilat 60 Saat!' : '60-Second Math Blitz!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1">
                  {lang === 'ms' 
                    ? 'Selesaikan seberapa banyak soalan tambah & tolak dalam masa 1 minit untuk kumpul skor tertinggi!' 
                    : 'Solve as many addition and subtraction questions as you can in 1 minute to set a new high score!'}
                </p>
              </div>

              {/* Best score record */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 inline-flex items-center gap-2 text-xs font-bold text-amber-900">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>
                  {lang === 'ms' ? `Rekod Terbaik Anda: ${bestSpeedScore} Mata` : `Your Best Score: ${bestSpeedScore} Points`}
                </span>
              </div>

              <div>
                <button
                  onClick={startSpeedMath}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-base shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
                >
                  <Flame className="w-5 h-5 text-yellow-300" />
                  <span>{lang === 'ms' ? 'Mula Sekarang!' : 'Start Blitz!'}</span>
                </button>
              </div>
            </div>
          ) : speedActive ? (
            /* Active 60s Game Screen */
            <div className="space-y-6">
              {/* Header: Timer & Live Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-black text-base">
                  <Timer className="w-5 h-5 animate-pulse" />
                  <span>{timeLeft}s</span>
                </div>

                {speedCombo > 1 && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black animate-bounce-slow">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>COMBO x{speedCombo}</span>
                  </div>
                )}

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-bold uppercase">{lang === 'ms' ? 'Skor' : 'Score'}</div>
                  <div className="text-2xl font-black text-amber-600">{speedScore}</div>
                </div>
              </div>

              {/* Question Card */}
              <div className="py-8 bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-200">
                <div className="text-4xl sm:text-5xl font-black text-amber-950 tracking-wider">
                  {speedQuiz.text}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {speedQuiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSpeedQuiz(opt)}
                    className="p-4 rounded-2xl border-2 border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-400 font-black text-3xl text-slate-800 shadow-sm transition-all active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Time's Up Screen */
            <div className="py-6 space-y-4">
              <div className="text-6xl animate-bounce-slow">🎉</div>
              <h3 className="text-2xl font-black text-slate-800">
                {lang === 'ms' ? 'Masa Tamat!' : 'Time\'s Up!'}
              </h3>
              <p className="text-sm text-slate-600">
                {lang === 'ms' ? `Anda berjaya mencapai ${speedScore} mata!` : `You achieved ${speedScore} points!`}
              </p>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 inline-block font-bold text-xs space-y-1">
                <div>{lang === 'ms' ? `+${speedScore * 15} Mata Pengalaman (XP) 🌟` : `+${speedScore * 15} Experience (XP) 🌟`}</div>
                <div>{lang === 'ms' ? `+${speedScore * 5} Koin Emas 🪙` : `+${speedScore * 5} Gold Coins 🪙`}</div>
              </div>

              <div>
                <button
                  onClick={startSpeedMath}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
                >
                  {lang === 'ms' ? 'Main Sekali Lagi' : 'Play Again'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
