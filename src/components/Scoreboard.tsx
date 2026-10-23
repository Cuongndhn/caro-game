import React from 'react';
import { Player, GameStatus, GameMode, AIDifficulty, GameStats } from '../types/caro';
import { User, Bot, Clock, Flame, Award } from 'lucide-react';

interface ScoreboardProps {
  currentPlayer: Player;
  status: GameStatus;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  stats: GameStats;
  turnTimeLeft: number | null;
  timerMode: number;
  isAiThinking: boolean;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  currentPlayer,
  status,
  gameMode,
  aiDifficulty,
  stats,
  turnTimeLeft,
  timerMode,
  isAiThinking,
}) => {
  const difficultyLabels: Record<AIDifficulty, string> = {
    easy: 'Tập sự',
    medium: 'Trung bình',
    hard: 'Cao thủ',
    master: 'Bậc thầy',
  };

  const isXTurn = currentPlayer === 'X' && status === 'PLAYING';
  const isOTurn = currentPlayer === 'O' && status === 'PLAYING';

  return (
    <div className="w-full bg-white rounded-xl border border-stone-200/80 p-4 shadow-sm mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
        {/* Player X (Blue) */}
        <div
          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
            isXTurn
              ? 'bg-blue-50/80 border border-blue-200 ring-2 ring-blue-500/20 shadow-sm'
              : 'bg-stone-50/60 border border-transparent'
          }`}
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-xl">
              ✕
            </div>
            {isXTurn && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-stone-900 truncate">
                {gameMode === 'AI' ? 'Bạn (Quân X)' : 'Người chơi 1 (X)'}
              </span>
              {isXTurn && (
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                  Đang đi
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
              <span>Thắng: <strong className="text-stone-800 font-semibold">{stats.xWins}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-stone-400" /> Đi trước
              </span>
            </div>
          </div>
        </div>

        {/* Center: Match Status & Timer */}
        <div className="flex flex-col items-center justify-center text-center px-2 py-1">
          {status === 'PLAYING' ? (
            <>
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                {isAiThinking ? (
                  <span className="text-amber-600 flex items-center gap-1.5 animate-pulse">
                    <Bot className="w-3.5 h-3.5" /> AI đang tính toán nước cờ...
                  </span>
                ) : (
                  <span>
                    Lượt của: <strong className={currentPlayer === 'X' ? 'text-blue-600 font-bold' : 'text-rose-600 font-bold'}>
                      Quân {currentPlayer}
                    </strong>
                  </span>
                )}
              </div>

              {timerMode > 0 && turnTimeLeft !== null && (
                <div className="w-full max-w-[180px]">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Thời gian
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        turnTimeLeft <= 5 ? 'text-rose-600 animate-pulse' : 'text-stone-700'
                      }`}
                    >
                      {turnTimeLeft}s
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        turnTimeLeft <= 5
                          ? 'bg-rose-500'
                          : turnTimeLeft <= 10
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(0, (turnTimeLeft / timerMode) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {timerMode === 0 && (
                <div className="text-xs text-stone-400 flex items-center gap-1">
                  <span>Không giới hạn thời gian</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-sm font-bold text-stone-800">
              {status === 'WON' ? 'Trận đấu kết thúc' : 'Ván đấu hòa'}
            </div>
          )}

          {/* Quick Stats Line */}
          <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
            <span>Tổng số ván: <strong className="text-stone-700">{stats.totalGames}</strong></span>
            {stats.streak > 1 && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-amber-600 font-medium">
                  <Flame className="w-3 h-3 fill-amber-500 text-amber-500" /> {stats.streak} trận thắng liên tiếp
                </span>
              </>
            )}
          </div>
        </div>

        {/* Player O (Red) */}
        <div
          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
            isOTurn
              ? 'bg-rose-50/80 border border-rose-200 ring-2 ring-rose-500/20 shadow-sm'
              : 'bg-stone-50/60 border border-transparent'
          }`}
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-sm font-bold text-xl">
              ◯
            </div>
            {isOTurn && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-stone-900 truncate">
                {gameMode === 'AI' ? `Máy AI (${difficultyLabels[aiDifficulty]})` : 'Người chơi 2 (O)'}
              </span>
              {isOTurn && (
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-100/70 px-1.5 py-0.5 rounded">
                  Đang đi
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
              <span>Thắng: <strong className="text-stone-800 font-semibold">{stats.oWins}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1">
                {gameMode === 'AI' ? <Bot className="w-3 h-3 text-stone-400" /> : <User className="w-3 h-3 text-stone-400" />}
                {gameMode === 'AI' ? difficultyLabels[aiDifficulty] : 'Đi sau'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
