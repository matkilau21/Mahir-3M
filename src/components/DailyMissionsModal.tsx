import React from 'react';
import { X, CheckCircle2, Coins, Star, Award, Check } from 'lucide-react';
import { DailyMission, Language, UserProfile } from '../types';
import { DAILY_MISSIONS } from '../data/dailyMissionsData';
import { soundService } from '../services/soundService';

interface DailyMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  profile: UserProfile;
  onClaimReward: (mission: DailyMission) => void;
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  isOpen,
  onClose,
  lang,
  profile,
  onClaimReward,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border-2 border-amber-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl shadow-xs">
              🎯
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-800">
                {lang === 'ms' ? 'Misi Harian Murid 3M' : 'Daily 3M Quests'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ms' ? 'Selesaikan misi setiap hari untuk kumpul koin dan XP!' : 'Finish quests each day to collect coins and XP!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Missions List */}
        <div className="space-y-3">
          {DAILY_MISSIONS.map((mission) => {
            let current = 0;
            if (mission.type === 'reading') current = profile.readingCompletedCount;
            else if (mission.type === 'writing') current = profile.writingCompletedCount;
            else if (mission.type === 'math') current = profile.mathCompletedCount;
            else if (mission.type === 'speed_math') current = profile.speedMathBestScore > 0 ? 1 : 0;

            const isCompleted = current >= mission.totalRequired;
            const isClaimed = profile.claimedDailyMissionIds.includes(mission.id);

            return (
              <div
                key={mission.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isClaimed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : isCompleted
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {lang === 'ms' ? mission.titleMs : mission.titleEn}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lang === 'ms' ? mission.descMs : mission.descEn}
                    </p>

                    {/* Progress count */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (current / mission.totalRequired) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">
                        {Math.min(current, mission.totalRequired)} / {mission.totalRequired}
                      </span>
                    </div>
                  </div>

                  {/* Reward / Claim Action */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1.5 text-xs font-black text-amber-600 mb-1.5">
                      <Coins className="w-3.5 h-3.5 text-yellow-600" />
                      <span>+{mission.coinsReward}</span>
                      <span className="text-slate-400">•</span>
                      <span>+{mission.xpReward} XP</span>
                    </div>

                    {isClaimed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 px-2 py-1 rounded-lg bg-slate-100">
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>{lang === 'ms' ? 'Dituntut' : 'Claimed'}</span>
                      </span>
                    ) : isCompleted ? (
                      <button
                        onClick={() => {
                          soundService.playCoin();
                          onClaimReward(mission);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 animate-pulse"
                      >
                        {lang === 'ms' ? 'Tuntut Koin!' : 'Claim Coins!'}
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">
                        {lang === 'ms' ? 'Belum Selesai' : 'In Progress'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-xs text-slate-400">
          {lang === 'ms' ? '💡 Misi akan diperbaharui setiap hari untuk memastikan kamu sentiasa rajin belajar!' : '💡 Quests refresh daily to keep your learning habits active!'}
        </div>
      </div>
    </div>
  );
};
