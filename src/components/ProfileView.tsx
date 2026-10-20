import React, { useState } from 'react';
import { 
  User, 
  Award, 
  Star, 
  Coins, 
  Flame, 
  BookOpen, 
  PenTool, 
  Calculator, 
  Lock, 
  CheckCircle, 
  Printer, 
  Edit3, 
  Save, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Language, UserProfile, GradeLevel } from '../types';
import { AVATAR_OPTIONS, getAvatarById } from '../data/avatarsData';
import { BADGES_DATA } from '../data/badgesData';
import { soundService } from '../services/soundService';

interface ProfileViewProps {
  lang: Language;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  lang,
  profile,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editNickname, setEditNickname] = useState(profile.nickname);
  const [editGrade, setEditGrade] = useState<GradeLevel>(profile.grade);
  const [editSchool, setEditSchool] = useState(profile.schoolName || 'SK Taman Sri Bintang');
  const [editAvatarId, setEditAvatarId] = useState(profile.avatarId);
  const [showCertificate, setShowCertificate] = useState(false);

  const avatar = getAvatarById(profile.avatarId);

  const handleSaveProfile = () => {
    soundService.playSuccess();
    onUpdateProfile({
      name: editName,
      nickname: editNickname,
      grade: editGrade,
      schoolName: editSchool,
      avatarId: editAvatarId,
    });
    setIsEditing(false);
  };

  const handlePrintCertificate = () => {
    soundService.playPop();
    window.print();
  };

  // Level Title calculation
  const getLevelTitle = (lvl: number) => {
    if (lang === 'ms') {
      if (lvl >= 10) return 'Tokoh Cemerlang 3M 👑';
      if (lvl >= 7) return 'Adiwira Bestari 3M 🌟';
      if (lvl >= 5) return 'Jaguh Mahir 3M 🚀';
      if (lvl >= 3) return 'Bintang Pintar ⭐';
      return 'Peneroka Novis 🌱';
    } else {
      if (lvl >= 10) return 'Grand 3M Scholar 👑';
      if (lvl >= 7) return 'Master Adventurer 🌟';
      if (lvl >= 5) return '3M Champion 🚀';
      if (lvl >= 3) return 'Rising Star ⭐';
      return 'Novice Explorer 🌱';
    }
  };

  const gradeOptions: GradeLevel[] = ['Prasekolah', 'Tahun 1', 'Tahun 2', 'Tahun 3', 'Pemulihan Khas'];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Profile Header & ID Card */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Avatar & Pupil Name */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr ${avatar.bg} border-4 border-white/90 shadow-2xl flex items-center justify-center text-5xl sm:text-6xl`}>
              {avatar.emoji}
              <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[11px] shadow-sm">
                Lv.{profile.level}
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{profile.grade} • {profile.schoolName || 'SK Pintar Gemilang'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">
                {profile.name}
              </h1>
              <p className="text-sm text-white/90 font-bold mt-0.5">
                {getLevelTitle(profile.level)}
              </p>
            </div>
          </div>

          {/* Action Buttons: Edit & Sijil */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                soundService.playPop();
                setShowCertificate(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>{lang === 'ms' ? 'Lihat Sijil 3M' : 'View Certificate'}</span>
            </button>

            <button
              onClick={() => {
                soundService.playPop();
                setIsEditing(!isEditing);
              }}
              className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? (lang === 'ms' ? 'Tutup Edit' : 'Cancel') : (lang === 'ms' ? 'Kemaskini Profil' : 'Edit Profile')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form Modal/Drawer if active */}
      {isEditing && (
        <div className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-md space-y-4 animate-pulse-gentle">
          <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-purple-600" />
            <span>{lang === 'ms' ? 'Kemaskini Maklumat Murid & Avatar' : 'Update Pupil Info & Avatar'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {lang === 'ms' ? 'Nama Penuh Murid:' : 'Pupil Full Name:'}
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {lang === 'ms' ? 'Nama Panggilan:' : 'Nickname:'}
              </label>
              <input
                type="text"
                value={editNickname}
                onChange={(e) => setEditNickname(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {lang === 'ms' ? 'Darjah / Tahap Persekolahan:' : 'Grade / Year Level:'}
              </label>
              <select
                value={editGrade}
                onChange={(e) => setEditGrade(e.target.value as GradeLevel)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-400"
              >
                {gradeOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {lang === 'ms' ? 'Nama Sekolah:' : 'School Name:'}
              </label>
              <input
                type="text"
                value={editSchool}
                onChange={(e) => setEditSchool(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Avatar selector */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-600 block mb-2">
              {lang === 'ms' ? 'Pilih Avatar Haiwan Comel:' : 'Select Animal Avatar:'}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => {
                    soundService.playPop();
                    setEditAvatarId(av.id);
                  }}
                  className={`p-2 rounded-2xl flex flex-col items-center border-2 transition-all ${
                    editAvatarId === av.id
                      ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-300 scale-105 shadow-sm'
                      : 'border-slate-200 hover:border-purple-300 bg-white'
                  }`}
                >
                  <span className="text-2xl mb-1">{av.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-600 truncate w-full text-center">{av.animal}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
            >
              {lang === 'ms' ? 'Batal' : 'Cancel'}
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{lang === 'ms' ? 'Simpan Profil' : 'Save Profile'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Gamification Key Stats Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Stars */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-500 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">{lang === 'ms' ? 'Bintang' : 'Stars'}</span>
            <span className="text-xl font-black text-slate-800">{profile.stars}</span>
          </div>
        </div>

        {/* Gold Coins */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">{lang === 'ms' ? 'Koin Emas' : 'Coins'}</span>
            <span className="text-xl font-black text-slate-800">{profile.coins}</span>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">{lang === 'ms' ? 'Rentetan' : 'Streak'}</span>
            <span className="text-xl font-black text-slate-800">{profile.streakDays} {lang === 'ms' ? 'Hari' : 'Days'}</span>
          </div>
        </div>

        {/* Total Badges */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">{lang === 'ms' ? 'Lencana' : 'Badges'}</span>
            <span className="text-xl font-black text-slate-800">{profile.unlockedBadgeIds.length} / {BADGES_DATA.length}</span>
          </div>
        </div>
      </div>

      {/* 3M Competency Progress Cards */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-slate-800">
          {lang === 'ms' ? 'Kemajuan Penguasaan Kemahiran 3M' : '3M Mastery Progress'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Membaca Card */}
          <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-extrabold text-sm text-slate-800">
                  {lang === 'ms' ? 'Kemahiran Membaca' : 'Reading Skill'}
                </span>
              </div>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {profile.readingCompletedCount} {lang === 'ms' ? 'Selesai' : 'Done'}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, profile.readingCompletedCount * 25)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {lang === 'ms' ? 'Fonik vokal, konsonan & sebutan suku kata KV.' : 'Vowels phonics, consonants & syllable reading.'}
            </p>
          </div>

          {/* Menulis Card */}
          <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-purple-600" />
                <span className="font-extrabold text-sm text-slate-800">
                  {lang === 'ms' ? 'Kemahiran Menulis' : 'Writing Skill'}
                </span>
              </div>
              <span className="text-xs font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                {profile.writingCompletedCount} {lang === 'ms' ? 'Selesai' : 'Done'}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, profile.writingCompletedCount * 33)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {lang === 'ms' ? 'Lakaran huruf papan tulis & ejaan susun perkataan.' : 'Writing pad tracing & word scramble spelling.'}
            </p>
          </div>

          {/* Mengira Card */}
          <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-600" />
                <span className="font-extrabold text-sm text-slate-800">
                  {lang === 'ms' ? 'Kemahiran Mengira' : 'Math Skill'}
                </span>
              </div>
              <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                {profile.mathCompletedCount} {lang === 'ms' ? 'Selesai' : 'Done'}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, profile.mathCompletedCount * 25)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {lang === 'ms' ? 'Kira objek 1-20, operasi tambah, tolak & kilat 60s.' : 'Counting objects 1-20, plus, minus & 60s blitz.'}
            </p>
          </div>
        </div>
      </div>

      {/* Badges Showcase Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800">
              {lang === 'ms' ? 'Galeri Lencana Pencapaian 🏅' : 'Achievement Badges Showcase 🏅'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'ms' 
                ? 'Kumpul semua 12 lencana istimewa untuk menjadi Adiwira Mahir 3M!' 
                : 'Collect all 12 special badges to become a Grand 3M Scholar!'}
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            {profile.unlockedBadgeIds.length} / {BADGES_DATA.length} {lang === 'ms' ? 'Dibuka' : 'Unlocked'}
          </span>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {BADGES_DATA.map((badge) => {
            const isUnlocked = profile.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`relative p-4 rounded-3xl border-2 transition-all ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-md hover:scale-102 ring-1 ring-amber-100'
                    : 'bg-slate-50/80 border-slate-200 opacity-60'
                }`}
              >
                {/* Badge Icon & Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
                    isUnlocked
                      ? `bg-gradient-to-tr ${badge.color} text-white`
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    {badge.icon}
                  </div>

                  {isUnlocked ? (
                    <span className="p-1 rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="p-1 rounded-full bg-slate-200 text-slate-500">
                      <Lock className="w-4 h-4" />
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-sm text-slate-900">
                  {lang === 'ms' ? badge.titleMs : badge.titleEn}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  {lang === 'ms' ? badge.descMs : badge.descEn}
                </p>

                {/* Requirement clue */}
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                  {lang === 'ms' ? `Syarat: ${badge.reqDescriptionMs}` : `Req: ${badge.reqDescriptionEn}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border-8 border-amber-300 print:border-none print:shadow-none">
            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-amber-100 pb-4">
              <div className="text-4xl mb-1">🏅</div>
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 block">
                {lang === 'ms' ? 'KEMENTERIAN PENDIDIKAN MALAYSIA • PROGRAM INTERVENSI 3M' : 'MALAYSIAN EDUCATION INITIATIVE • 3M INTERVENTION'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {lang === 'ms' ? 'SIJIL PENGHARGAAN PEMERKASAAN 3M' : '3M MASTERY CERTIFICATE OF ACHIEVEMENT'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ms' ? 'Dengan ini diperakui bahawa murid bijak:' : 'This hereby certifies that the student:'}
              </p>
            </div>

            {/* Student Name */}
            <div className="py-6 text-center">
              <h3 className="text-3xl sm:text-4xl font-black text-amber-700 underline decoration-amber-400 underline-offset-8">
                {profile.name}
              </h3>
              <p className="text-sm font-bold text-slate-700 mt-3">
                {profile.grade} • {profile.schoolName || 'SK Pintar Gemilang'}
              </p>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                {lang === 'ms'
                  ? 'Telah menunjukkan kesungguhan dan kecemerlangan tinggi dalam menguasai kemahiran asas Membaca, Menulis, dan Mengira (3M).'
                  : 'Has demonstrated great dedication and excellence in mastering the fundamental skills of Reading, Writing, and Arithmetic (3M).'}
              </p>
            </div>

            {/* Certificate Badges & Seals */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-amber-100 text-xs">
              <div className="text-left">
                <span className="font-extrabold text-slate-700 block">
                  {lang === 'ms' ? 'Pencapaian:' : 'Achievements:'}
                </span>
                <span className="text-slate-500">
                  {profile.unlockedBadgeIds.length} {lang === 'ms' ? 'Lencana' : 'Badges'} • {profile.stars} ⭐ • {profile.xp} XP
                </span>
              </div>

              {/* Official Stamp */}
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 flex flex-col items-center justify-center text-amber-700 rotate-12 shadow-xs">
                <span className="text-[9px] font-black uppercase text-center leading-tight">Misi 3M<br/>SAH</span>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-slate-700 block">Cikgu Maya & Pasukan 3M</span>
                <span className="text-slate-500">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 print:hidden">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                {lang === 'ms' ? 'Tutup' : 'Close'}
              </button>
              <button
                onClick={handlePrintCertificate}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'ms' ? 'Cetak / Simpan Sijil' : 'Print / Save Certificate'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
