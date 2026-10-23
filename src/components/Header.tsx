import React from 'react';
import { Volume2, VolumeX, RotateCcw, BookOpen, Settings } from 'lucide-react';

interface HeaderProps {
  onNewGame: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewGame,
  onOpenRules,
  onOpenSettings,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-stone-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center shadow-sm text-white font-bold text-lg select-none">
          <span className="text-amber-100">C</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-stone-900 leading-tight">
            Cờ Caro Việt
          </span>
          <span className="text-[11px] text-stone-500 font-medium">
            Gomoku Pro · Chuẩn thi đấu
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation / Quick Action Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
        <button
          onClick={onOpenRules}
          className="flex items-center gap-1.5 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-stone-500" />
          <span>Luật chơi & Mẹo</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-stone-500" />
          <span>Tùy chỉnh bàn cờ</span>
        </button>
        <button
          onClick={onToggleMute}
          className="flex items-center gap-1.5 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-600" />
          )}
          <span>{isMuted ? 'Đã tắt tiếng' : 'Âm thanh'}</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onNewGame}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-800 rounded-lg hover:bg-amber-900 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ván Mới</span>
        </button>
      </div>
    </header>
  );
};
