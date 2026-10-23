import React from 'react';
import { BoardTheme, BoardSize, TimerMode } from '../types/caro';
import { X, Palette, Volume2, VolumeX, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: BoardTheme;
  onSetTheme: (theme: BoardTheme) => void;
  boardSize: BoardSize;
  onSetBoardSize: (size: BoardSize) => void;
  timerMode: TimerMode;
  onSetTimerMode: (time: TimerMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetStats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSetTheme,
  boardSize,
  onSetBoardSize,
  timerMode,
  onSetTimerMode,
  isMuted,
  onToggleMute,
  onResetStats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <Palette className="w-5 h-5 text-amber-700" />
            <span>Tùy Chỉnh Giao Diện & Trận Đấu</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-stone-700">
          {/* Theme Option */}
          <div>
            <label className="block font-bold text-stone-900 mb-2">
              Chủ đề mặt bàn cờ
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onSetTheme('wood')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  theme === 'wood'
                    ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-600/20 font-bold text-amber-950'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-700 border-2 border-amber-900 shadow-sm" />
                <span>Gỗ Tự Nhiên</span>
              </button>

              <button
                onClick={() => onSetTheme('paper')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  theme === 'paper'
                    ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-600/20 font-bold text-amber-950'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-stone-100 border-2 border-stone-300 shadow-sm" />
                <span>Giấy Mộc</span>
              </button>

              <button
                onClick={() => onSetTheme('slate')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  theme === 'slate'
                    ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-600/20 font-bold text-amber-950'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 shadow-sm" />
                <span>Đêm Huyền Bí</span>
              </button>
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200/60">
            <div className="flex items-center gap-2.5">
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              )}
              <div>
                <div className="font-bold text-stone-900">Âm thanh đặt quân & thắng</div>
                <div className="text-[11px] text-stone-500">Hiệu ứng tiếng gõ quân gỗ chân thực</div>
              </div>
            </div>
            <button
              onClick={onToggleMute}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isMuted ? 'Bật âm' : 'Đang bật'}
            </button>
          </div>

          {/* Reset Score */}
          <div className="flex items-center justify-between p-3 bg-rose-50/60 rounded-xl border border-rose-100">
            <div>
              <div className="font-bold text-rose-950">Đặt lại thống kê ván đấu</div>
              <div className="text-[11px] text-rose-700">Xóa số ván thắng và chuỗi trận hiện tại</div>
            </div>
            <button
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ điểm số về 0 không?')) {
                  onResetStats();
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-white border border-rose-200 hover:bg-rose-100/50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa điểm</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-100 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
