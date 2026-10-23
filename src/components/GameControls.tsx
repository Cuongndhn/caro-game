import React from 'react';
import { GameMode, AIDifficulty, RuleSet, BoardSize, TimerMode } from '../types/caro';
import {
  Undo2,
  Redo2,
  Lightbulb,
  Hash,
  Flag,
  Sparkles,
  Bot,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface GameControlsProps {
  gameMode: GameMode;
  onSetGameMode: (mode: GameMode) => void;
  aiDifficulty: AIDifficulty;
  onSetAiDifficulty: (diff: AIDifficulty) => void;
  ruleSet: RuleSet;
  onSetRuleSet: (rules: RuleSet) => void;
  boardSize: BoardSize;
  onSetBoardSize: (size: BoardSize) => void;
  timerMode: TimerMode;
  onSetTimerMode: (t: TimerMode) => void;
  canUndo: boolean;
  onUndo: () => void;
  canRedo: boolean;
  onRedo: () => void;
  onGetHint: () => void;
  showMoveNumbers: boolean;
  onToggleMoveNumbers: () => void;
  onResign: () => void;
  hintExplanation: string | null;
  isPlaying: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  onSetGameMode,
  aiDifficulty,
  onSetAiDifficulty,
  ruleSet,
  onSetRuleSet,
  boardSize,
  onSetBoardSize,
  timerMode,
  onSetTimerMode,
  canUndo,
  onUndo,
  canRedo,
  onRedo,
  onGetHint,
  showMoveNumbers,
  onToggleMoveNumbers,
  onResign,
  hintExplanation,
  isPlaying,
}) => {
  return (
    <div className="w-full bg-white rounded-xl border border-stone-200/80 p-4 shadow-sm flex flex-col gap-4">
      {/* Top Action Row: In-game quick tools */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              canUndo
                ? 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                : 'bg-stone-50 text-stone-300 cursor-not-allowed'
            }`}
            title="Đi lại nước trước (Undo)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Đi lại</span>
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              canRedo
                ? 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                : 'bg-stone-50 text-stone-300 cursor-not-allowed'
            }`}
            title="Đánh tiếp (Redo)"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span>Tiếp tục</span>
          </button>

          <button
            onClick={onGetHint}
            disabled={!isPlaying}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                : 'bg-stone-50 text-stone-300 cursor-not-allowed'
            }`}
            title="Nhận gợi ý nước đi tối ưu từ thuật toán Gomoku"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>Gợi ý</span>
          </button>

          <button
            onClick={onToggleMoveNumbers}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              showMoveNumbers
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
            title="Bật/tắt số thứ tự nước đi trên quân cờ"
          >
            <Hash className="w-3.5 h-3.5" />
            <span>{showMoveNumbers ? 'Ẩn số nước' : 'Hiện số nước'}</span>
          </button>
        </div>

        {isPlaying && (
          <button
            onClick={onResign}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Chấp nhận xin thua ván này"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Đầu hàng</span>
          </button>
        )}
      </div>

      {/* Hint Alert Bar if active */}
      {hintExplanation && (
        <div className="flex items-center gap-2 p-2.5 bg-amber-50/90 border border-amber-200/90 rounded-lg text-xs text-amber-900 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-medium">{hintExplanation}</span>
        </div>
      )}

      {/* Mode & Settings Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* 1. Game Mode */}
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-stone-600">Chế độ chơi</span>
          <div className="flex p-0.5 bg-stone-100 rounded-lg">
            <button
              onClick={() => onSetGameMode('AI')}
              className={`flex-1 py-1.5 px-2 font-medium rounded-md text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                gameMode === 'AI'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bot className="w-3 h-3" /> Đấu AI
            </button>
            <button
              onClick={() => onSetGameMode('PVP')}
              className={`flex-1 py-1.5 px-2 font-medium rounded-md text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                gameMode === 'PVP'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Users className="w-3 h-3" /> 2 Người
            </button>
          </div>
        </div>

        {/* 2. AI Difficulty (Only if AI mode) */}
        {gameMode === 'AI' ? (
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-stone-600">Cấp độ Máy AI</span>
            <select
              value={aiDifficulty}
              onChange={(e) => onSetAiDifficulty(e.target.value as AIDifficulty)}
              className="w-full bg-stone-100 hover:bg-stone-200/80 border border-transparent rounded-lg py-1.5 px-2.5 text-stone-800 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="easy">Tập sự (Dễ)</option>
              <option value="medium">Trung bình (Vừa)</option>
              <option value="hard">Cao thủ (Khó)</option>
              <option value="master">Bậc thầy (Gomoku Pro)</option>
            </select>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-stone-600">Đồng hồ mỗi lượt</span>
            <select
              value={timerMode}
              onChange={(e) => onSetTimerMode(Number(e.target.value) as TimerMode)}
              className="w-full bg-stone-100 hover:bg-stone-200/80 border border-transparent rounded-lg py-1.5 px-2.5 text-stone-800 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value={0}>Không giới hạn</option>
              <option value={15}>15 giây (Cờ chớp)</option>
              <option value={30}>30 giây (Tiêu chuẩn)</option>
              <option value={60}>60 giây (Thư thả)</option>
            </select>
          </div>
        )}

        {/* 3. Rule set: Vietnam vs Freestyle */}
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-stone-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Luật cờ
          </span>
          <div className="flex p-0.5 bg-stone-100 rounded-lg">
            <button
              onClick={() => onSetRuleSet('vietnam')}
              className={`flex-1 py-1.5 px-2 font-medium rounded-md text-center transition-all cursor-pointer ${
                ruleSet === 'vietnam'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="5 quân nhưng không bị chặn cả 2 đầu bởi quân đối phương"
            >
              Chặn 2 đầu (VN)
            </button>
            <button
              onClick={() => onSetRuleSet('freestyle')}
              className={`flex-1 py-1.5 px-2 font-medium rounded-md text-center transition-all cursor-pointer ${
                ruleSet === 'freestyle'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Đủ 5 quân liên tiếp bất kể bị chặn"
            >
              Tự do (5+)
            </button>
          </div>
        </div>

        {/* 4. Board Size */}
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-stone-600">Bàn cờ</span>
          <div className="flex p-0.5 bg-stone-100 rounded-lg">
            <button
              onClick={() => onSetBoardSize(15)}
              className={`flex-1 py-1.5 px-2 font-medium rounded-md text-center transition-all cursor-pointer ${
                boardSize === 15
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              15 × 15 (Chuẩn)
            </button>
            <button
              onClick={() => onSetBoardSize(19)}
              className={`flex-1 py-1.5 px-2 font-medium rounded-md text-center transition-all cursor-pointer ${
                boardSize === 19
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              19 × 19 (Lớn)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
