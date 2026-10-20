import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Star, Award, X } from 'lucide-react';
import { Badge, Language } from '../types';
import { soundService } from '../services/soundService';

interface BadgeUnlockModalProps {
  badge: Badge | null;
  onClose: () => void;
  lang: Language;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({ badge, onClose, lang }) => {
  useEffect(() => {
    if (badge) {
      soundService.playBadgeUnlocked();

      // Launch joyful celebratory confetti bursts
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 250);
      } catch {
        // ignore if confetti blocked
      }
    }
  }, [badge]);

  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative border-4 border-amber-300 transform scale-100 animate-pulse-gentle">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Floating Sparkles & Badge Icon */}
        <div className="relative mx-auto my-3 w-24 h-24">
          <div className="absolute inset-0 rounded-3xl bg-amber-200 blur-lg animate-ping opacity-50" />
          <div className={`relative w-24 h-24 rounded-3xl bg-gradient-to-tr ${badge.color} border-4 border-white shadow-xl flex items-center justify-center text-5xl`}>
            {badge.icon}
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{lang === 'ms' ? 'Lencana Baharu Dibuka!' : 'New Badge Unlocked!'}</span>
        </div>

        <h3 className="text-2xl font-black text-slate-900">
          {lang === 'ms' ? badge.titleMs : badge.titleEn}
        </h3>

        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          {lang === 'ms' ? badge.descMs : badge.descEn}
        </p>

        <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-2">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{lang === 'ms' ? '+50 XP Bonus Pencapaian!' : '+50 XP Achievement Bonus!'}</span>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
        >
          {lang === 'ms' ? 'Hebat, Teruskan Misi!' : 'Awesome, Keep Going!'}
        </button>
      </div>
    </div>
  );
};
