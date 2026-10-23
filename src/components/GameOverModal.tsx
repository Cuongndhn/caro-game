import React, { useEffect, useRef } from 'react';
import { Player, WinningInfo, GameMode, AIDifficulty, GameStats } from '../types/caro';
import { Trophy, RotateCcw, Eye, Flame, Award } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  winner: Player | null; // null means draw
  winningInfo: WinningInfo | null;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  stats: GameStats;
  totalMoves: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner,
  winningInfo,
  gameMode,
  aiDifficulty,
  stats,
  totalMoves,
  onPlayAgain,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas confetti animation
  useEffect(() => {
    if (!isOpen || !winner) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      vRot: number;
    }

    const colors = ['#2563eb', '#dc2626', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];
    const particles: Particle[] = Array.from({ length: 90 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 300,
      y: canvas.height / 3 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -10 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.rotation += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const timer = setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
    }, 4500);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, [isOpen, winner]);

  if (!isOpen) return null;

  const isHumanWin = gameMode === 'AI' ? winner === 'X' : winner !== null;
  const isDraw = winner === null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      {/* Background celebration canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
      />

      <div className="relative z-20 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 text-center transform transition-all animate-scaleUp">
        {/* Badge Icon */}
        <div className="mx-auto mb-4 flex items-center justify-center">
          {isDraw ? (
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 shadow-inner">
              <Award className="w-8 h-8" />
            </div>
          ) : isHumanWin ? (
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner ring-4 ring-amber-200/50 animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-stone-900 tracking-tight mb-1">
          {isDraw
            ? 'Ván Đấu Hòa Cờ!'
            : gameMode === 'AI'
            ? winner === 'X'
              ? 'Chiến Thắng Tuyệt Vời!'
              : 'Máy AI Đã Thắng!'
            : `Người Chơi ${winner} Thắng Cuộc!`}
        </h2>

        {/* Subtitle / Rules description */}
        <p className="text-xs text-stone-600 mb-6">
          {isDraw
            ? 'Bàn cờ đã kín ô hoặc hai bên bắt tay hòa cờ.'
            : winningInfo?.ruleNotes || 'Tạo thành thế 5 quân liên tiếp hợp lệ.'}
        </p>

        {/* Match Statistics Card */}
        <div className="grid grid-cols-3 gap-2 bg-stone-50 rounded-xl p-3 mb-6 text-center border border-stone-100">
          <div>
            <div className="text-[11px] text-stone-500 font-medium">Tổng số nước</div>
            <div className="text-base font-bold font-mono text-stone-800">{totalMoves}</div>
          </div>
          <div>
            <div className="text-[11px] text-stone-500 font-medium">Tỉ số X - O</div>
            <div className="text-base font-bold font-mono text-stone-800">
              <span className="text-blue-600">{stats.xWins}</span> - <span className="text-rose-600">{stats.oWins}</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] text-stone-500 font-medium">Chuỗi thắng</div>
            <div className="text-base font-bold font-mono text-amber-600 flex items-center justify-center gap-0.5">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              {stats.streak}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Xem lại thế cờ</span>
          </button>

          <button
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 active:scale-98 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi ván tiếp theo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
