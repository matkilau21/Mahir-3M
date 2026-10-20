import React, { useState, useRef, useEffect } from 'react';
import { 
  Eraser, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Star, 
  Palette, 
  Volume2, 
  ArrowRight,
  PenTool,
  Award
} from 'lucide-react';
import { Language } from '../types';
import { 
  TRACE_TEMPLATES, 
  WORD_SCRAMBLE_LIST, 
  MISSING_LETTER_LIST,
  TraceLetterTemplate,
  WordScrambleTask
} from '../data/curriculumData';
import { soundService } from '../services/soundService';

interface WritingIslandProps {
  lang: Language;
  onEarnRewards: (xp: number, stars: number, coins: number, activityType: 'writing') => void;
}

type WritingSubTab = 'pad' | 'scramble' | 'missing';

export const WritingIsland: React.FC<WritingIslandProps> = ({ lang, onEarnRewards }) => {
  const [activeTab, setActiveTab] = useState<WritingSubTab>('pad');

  // Canvas Tracing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [brushColor, setBrushColor] = useState('#2563eb'); // default royal blue
  const [brushSize, setBrushSize] = useState(12);
  const [traceFeedback, setTraceFeedback] = useState<{ stars: number; message: string } | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Word Scramble state
  const [scrambleIndex, setScrambleIndex] = useState(0);
  const currentScramble = WORD_SCRAMBLE_LIST[scrambleIndex];
  const targetWord = lang === 'ms' ? currentScramble.wordMs : currentScramble.wordEn;
  const initialLetters = lang === 'ms' ? currentScramble.lettersMs : currentScramble.lettersEn;
  const [availableLetters, setAvailableLetters] = useState<string[]>(initialLetters);
  const [assembledWord, setAssembledWord] = useState<string[]>([]);
  const [scrambleSuccess, setScrambleSuccess] = useState(false);

  // Missing letter state
  const [missingIndex, setMissingIndex] = useState(0);
  const currentMissing = MISSING_LETTER_LIST[missingIndex];
  const [missingSelected, setMissingSelected] = useState<string | null>(null);
  const [missingSuccess, setMissingSuccess] = useState(false);

  const currentTemplate = TRACE_TEMPLATES[selectedTemplateIndex];

  // Draw template background guide on canvas
  const drawGuideTemplate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw horizontal notebook guidelines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);

    const yMid = canvas.height / 2;
    const yTop = canvas.height * 0.22;
    const yBot = canvas.height * 0.78;

    // Top guide line
    ctx.beginPath();
    ctx.moveTo(30, yTop);
    ctx.lineTo(canvas.width - 30, yTop);
    ctx.stroke();

    // Middle dashed guide line
    ctx.strokeStyle = '#fca5a5'; // light red dashed baseline
    ctx.beginPath();
    ctx.moveTo(30, yMid);
    ctx.lineTo(canvas.width - 30, yMid);
    ctx.stroke();

    // Bottom solid guide line
    ctx.strokeStyle = '#93c5fd';
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(30, yBot);
    ctx.lineTo(canvas.width - 30, yBot);
    ctx.stroke();

    // Draw large faint dotted reference character in center
    ctx.save();
    ctx.font = 'bold 180px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f1f5f9';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.fillText(currentTemplate.display, canvas.width / 2, canvas.height / 2 + 10);
    ctx.strokeText(currentTemplate.display, canvas.width / 2, canvas.height / 2 + 10);
    ctx.restore();
  };

  useEffect(() => {
    if (activeTab === 'pad') {
      drawGuideTemplate();
      setTraceFeedback(null);
      setHasDrawn(false);
    }
  }, [selectedTemplateIndex, activeTab]);

  // Sync scramble when index or language changes
  useEffect(() => {
    const current = WORD_SCRAMBLE_LIST[scrambleIndex];
    setAvailableLetters(lang === 'ms' ? [...current.lettersMs] : [...current.lettersEn]);
    setAssembledWord([]);
    setScrambleSuccess(false);
  }, [scrambleIndex, lang]);

  // Canvas drawing handlers
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClearCanvas = () => {
    soundService.playPop();
    drawGuideTemplate();
    setTraceFeedback(null);
    setHasDrawn(false);
  };

  const handleCheckHandwriting = () => {
    if (!hasDrawn) {
      soundService.playError();
      return;
    }

    soundService.playSuccess();
    const message = lang === 'ms' 
      ? 'Tahniah! Bentuk tulisan kamu sangat kemas dan cantik!' 
      : 'Awesome! Your handwriting strokes look great!';
    
    setTraceFeedback({ stars: 3, message });
    onEarnRewards(30, 2, 10, 'writing');
    soundService.speak(lang === 'ms' ? `Tulisan huruf ${currentTemplate.display} kamu sangat bagus!` : `Great job tracing ${currentTemplate.display}!`, lang);
  };

  // Word Scramble Handlers
  const handleSelectLetterTile = (letter: string, index: number) => {
    soundService.playPop();
    soundService.speak(letter, lang);

    const newAssembled = [...assembledWord, letter];
    setAssembledWord(newAssembled);

    const newAvailable = [...availableLetters];
    newAvailable.splice(index, 1);
    setAvailableLetters(newAvailable);

    // If word is complete, check spelling
    if (newAssembled.length === targetWord.length) {
      const spelled = newAssembled.join('').toUpperCase();
      if (spelled === targetWord.toUpperCase()) {
        soundService.playSuccess();
        setScrambleSuccess(true);
        setTimeout(() => {
          soundService.speak(targetWord, lang);
        }, 500);
        onEarnRewards(30, 2, 15, 'writing');
      } else {
        soundService.playError();
        setTimeout(() => {
          // Reset
          setAvailableLetters(lang === 'ms' ? [...currentScramble.lettersMs] : [...currentScramble.lettersEn]);
          setAssembledWord([]);
        }, 1000);
      }
    }
  };

  const handleUndoAssembled = (index: number) => {
    if (scrambleSuccess) return;
    soundService.playPop();
    const letter = assembledWord[index];
    const newAssembled = [...assembledWord];
    newAssembled.splice(index, 1);
    setAssembledWord(newAssembled);
    setAvailableLetters([...availableLetters, letter]);
  };

  const handleNextScramble = () => {
    soundService.playPop();
    setScrambleIndex((prev) => (prev + 1) % WORD_SCRAMBLE_LIST.length);
  };

  // Missing letter handlers
  const handleAnswerMissing = (option: string) => {
    if (missingSelected !== null) return;
    setMissingSelected(option);

    const isCorrect = lang === 'ms' 
      ? option === currentMissing.correctLetterMs 
      : option === currentMissing.correctLetterEn;

    if (isCorrect) {
      soundService.playSuccess();
      setMissingSuccess(true);
      onEarnRewards(25, 1, 10, 'writing');
      const fullWord = lang === 'ms' 
        ? currentMissing.displayWordMs.replace('_', option).replace(/\s+/g, '') 
        : currentMissing.displayWordEn.replace('_', option).replace(/\s+/g, '');
      soundService.speak(fullWord, lang);
    } else {
      soundService.playError();
    }
  };

  const handleNextMissing = () => {
    soundService.playPop();
    setMissingSelected(null);
    setMissingSuccess(false);
    setMissingIndex((prev) => (prev + 1) % MISSING_LETTER_LIST.length);
  };

  const colorPalette = [
    { name: 'Biru', color: '#2563eb' },
    { name: 'Merah', color: '#dc2626' },
    { name: 'Hijau', color: '#16a34a' },
    { name: 'Ungu', color: '#9333ea' },
    { name: 'Jingga', color: '#ea580c' },
    { name: 'Hitam', color: '#0f172a' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Module Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
            ✍️
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-1">
              {lang === 'ms' ? 'Modul Menulis 3M' : '3M Writing Module'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              {lang === 'ms' ? 'Pulau Menulis Kreatif' : 'Creative Writing Island'}
            </h1>
            <p className="text-xs sm:text-sm text-white/90">
              {lang === 'ms'
                ? 'Latih kemahiran melakar huruf, menyusun jubin perkataan, dan melengkapkan huruf yang hilang.'
                : 'Practice letter tracing strokes, assemble word scramble tiles, and fill in missing letters.'}
            </p>
          </div>
        </div>

        {/* Sub-Tabs Pills */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-2xl backdrop-blur-md flex-wrap justify-center">
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('pad');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'pad' ? 'bg-white text-purple-700 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {lang === 'ms' ? 'Papan Tulis & Tracing' : 'Tracing Pad'}
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('scramble');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'scramble' ? 'bg-white text-purple-700 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {lang === 'ms' ? 'Susun Huruf Kata' : 'Word Scramble'}
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('missing');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'missing' ? 'bg-white text-purple-700 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            {lang === 'ms' ? 'Huruf Yang Hilang' : 'Missing Letters'}
          </button>
        </div>
      </div>

      {/* 1. TRACING CANVAS PAD */}
      {activeTab === 'pad' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Selector Sidebar */}
          <div className="lg:col-span-1 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {lang === 'ms' ? 'Pilih Huruf / Nombor:' : 'Choose Letter / Number:'}
            </span>
            <div className="grid grid-cols-4 lg:grid-cols-3 gap-2">
              {TRACE_TEMPLATES.map((tmpl, idx) => {
                const isSelected = selectedTemplateIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      soundService.playPop();
                      setSelectedTemplateIndex(idx);
                    }}
                    className={`p-2 rounded-2xl border-2 font-black text-xl transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-300 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tmpl.display}
                  </button>
                );
              })}
            </div>

            {/* Template hint card */}
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <span className="text-base">{currentTemplate.emoji}</span>
                <span>{lang === 'ms' ? currentTemplate.sampleWordMs : currentTemplate.sampleWordEn}</span>
              </div>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                {lang === 'ms' ? currentTemplate.strokeHintMs : currentTemplate.strokeHintEn}
              </p>
            </div>
          </div>

          {/* Interactive Canvas Area */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            {/* Canvas Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Color Palette */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 mr-1">
                  {lang === 'ms' ? 'Warna:' : 'Color:'}
                </span>
                {colorPalette.map((cp) => (
                  <button
                    key={cp.color}
                    onClick={() => {
                      soundService.playPop();
                      setBrushColor(cp.color);
                    }}
                    style={{ backgroundColor: cp.color }}
                    className={`w-7 h-7 rounded-full shadow-xs transition-transform ${
                      brushColor === cp.color ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>

              {/* Brush Size */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  {lang === 'ms' ? 'Saiz Berus:' : 'Brush:'}
                </span>
                <input
                  type="range"
                  min="6"
                  max="24"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-24 accent-purple-600"
                />
              </div>

              {/* Reset/Clear Button */}
              <button
                onClick={handleClearCanvas}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ms' ? 'Kosongkan' : 'Clear'}</span>
              </button>
            </div>

            {/* Tracing Canvas */}
            <div className="relative w-full overflow-hidden rounded-2xl border-4 border-slate-100 bg-white shadow-inner flex items-center justify-center touch-none">
              <canvas
                ref={canvasRef}
                width={640}
                height={340}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full max-w-2xl h-[300px] sm:h-[340px] cursor-crosshair"
              />
            </div>

            {/* Check handwriting & Feedback */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500">
                {lang === 'ms' ? 'Gunakan jari atau tetikus untuk melakar mengikut garis titik.' : 'Trace the dotted guide using your finger or mouse.'}
              </div>

              <button
                onClick={handleCheckHandwriting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{lang === 'ms' ? 'Semak Tulisan Saya' : 'Check My Writing'}</span>
              </button>
            </div>

            {/* Reward Notification Banner */}
            {traceFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 animate-pulse-gentle flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex text-amber-400">
                    <Star className="w-5 h-5 fill-amber-400" />
                    <Star className="w-5 h-5 fill-amber-400" />
                    <Star className="w-5 h-5 fill-amber-400" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm">{traceFeedback.message}</span>
                </div>
                <div className="text-xs font-black text-emerald-700 shrink-0">
                  +30 XP • +2 ⭐
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. WORD SCRAMBLE SUB-TAB */}
      {activeTab === 'scramble' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'ms' ? `Perkataan ${scrambleIndex + 1} daripada ${WORD_SCRAMBLE_LIST.length}` : `Word ${scrambleIndex + 1} of ${WORD_SCRAMBLE_LIST.length}`}
            </span>
            <button
              onClick={handleNextScramble}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <span>{lang === 'ms' ? 'Seterusnya' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Picture Clue */}
          <div className="py-2">
            <div className="text-7xl mb-2 animate-bounce-slow">{currentScramble.emoji}</div>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'ms' ? currentScramble.hintMs : currentScramble.hintEn}
            </p>
          </div>

          {/* Target Answer Slots */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {lang === 'ms' ? 'Susun Huruf Di Sini:' : 'Arrange Letters Here:'}
            </span>
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap min-h-[64px]">
              {Array.from({ length: targetWord.length }).map((_, idx) => {
                const letter = assembledWord[idx];
                return (
                  <button
                    key={idx}
                    disabled={!letter || scrambleSuccess}
                    onClick={() => handleUndoAssembled(idx)}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all ${
                      letter
                        ? 'border-purple-500 bg-purple-100 text-purple-900 shadow-md hover:bg-purple-200 active:scale-95'
                        : 'border-dashed border-slate-300 bg-slate-50 text-slate-300'
                    }`}
                  >
                    {letter || ''}
                  </button>
                );
              })}
            </div>
            {assembledWord.length > 0 && !scrambleSuccess && (
              <span className="text-[11px] text-slate-400 italic block">
                {lang === 'ms' ? '💡 Tekan huruf di atas untuk padam balik' : '💡 Tap a letter above to put it back'}
              </span>
            )}
          </div>

          {/* Celebration Success */}
          {scrambleSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 animate-pulse-gentle">
              <div className="flex items-center justify-center gap-2 text-xl font-black">
                <Sparkles className="w-6 h-6 text-emerald-500" />
                <span>{lang === 'ms' ? `Tahniah! Ejaan Betul: ${targetWord}` : `Awesome! Correct Spelling: ${targetWord}`}</span>
                <Sparkles className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-xs text-emerald-700 mt-1 font-semibold">
                {lang === 'ms' ? '+30 XP • +2 Bintang • +15 Koin Emas diraih!' : '+30 XP • +2 Stars • +15 Coins earned!'}
              </p>
              <button
                onClick={handleNextScramble}
                className="mt-3 px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                {lang === 'ms' ? 'Perkataan Seterusnya' : 'Next Word'}
              </button>
            </div>
          )}

          {/* Available Letter Tiles */}
          {!scrambleSuccess && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {lang === 'ms' ? 'Pilih Huruf:' : 'Choose Letters:'}
              </span>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {availableLetters.map((char, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectLetterTile(char, i)}
                    className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-2xl shadow-md border-b-4 border-amber-600 active:translate-y-1 active:border-b-0 transition-all"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. MISSING LETTER SUB-TAB */}
      {activeTab === 'missing' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'ms' ? `Tugasan ${missingIndex + 1} daripada ${MISSING_LETTER_LIST.length}` : `Task ${missingIndex + 1} of ${MISSING_LETTER_LIST.length}`}
            </span>
            <button
              onClick={handleNextMissing}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <span>{lang === 'ms' ? 'Seterusnya' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-2">
            <div className="text-7xl mb-2">{currentMissing.emoji}</div>
            <div className="text-3xl sm:text-4xl font-black text-purple-950 tracking-widest py-3">
              {lang === 'ms' ? currentMissing.displayWordMs : currentMissing.displayWordEn}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'ms' ? 'Lengkapkan huruf yang hilang untuk membentuk perkataan betul.' : 'Choose the missing letter to complete the correct word.'}
            </p>
          </div>

          {/* Options */}
          <div className="flex items-center justify-center gap-3">
            {(lang === 'ms' ? currentMissing.optionsMs : currentMissing.optionsEn).map((opt, idx) => {
              const isSelected = missingSelected === opt;
              const isCorrect = lang === 'ms' ? opt === currentMissing.correctLetterMs : opt === currentMissing.correctLetterEn;

              let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
              if (missingSelected !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md ring-2 ring-emerald-300';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 border-rose-600 text-white';
                } else {
                  btnStyle = 'opacity-40 bg-slate-100 border-slate-200 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={missingSelected !== null}
                  onClick={() => handleAnswerMissing(opt)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 font-black text-3xl shadow-xs transition-all active:scale-95 ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {missingSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 animate-pulse-gentle">
              <span className="font-extrabold text-sm">
                {lang === 'ms' ? 'Tepat Sekali! +25 XP diraih!' : 'Spot on! +25 XP earned!'}
              </span>
              <div className="mt-2">
                <button
                  onClick={handleNextMissing}
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  {lang === 'ms' ? 'Soalan Seterusnya' : 'Next Question'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
