import React from 'react';
import { Move } from '../types/caro';
import { getCoordinateLabel } from '../utils/caroEngine';
import { History, ChevronRight } from 'lucide-react';

interface MoveHistoryProps {
  moves: Move[];
  boardSize: number;
  currentMoveIndex: number;
  onSelectMove: (index: number) => void;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  boardSize,
  currentMoveIndex,
  onSelectMove,
}) => {
  return (
    <div className="w-full bg-white rounded-xl border border-stone-200/80 p-4 shadow-sm flex flex-col h-full max-h-[380px]">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-2">
        <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
          <History className="w-4 h-4 text-stone-500" />
          <span>Biên bản nước đi</span>
        </div>
        <span className="text-xs text-stone-500 font-mono">
          {moves.length} nước
        </span>
      </div>

      {moves.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-400 text-xs">
          <span>Chưa có nước đi nào.</span>
          <span className="mt-1 text-stone-500 font-medium">
            Quân X đánh trước, nhấp vào ô bất kỳ để bắt đầu!
          </span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 space-y-1">
          {/* Pair moves in rounds: X and O side-by-side */}
          {Array.from({ length: Math.ceil(moves.length / 2) }, (_, roundIdx) => {
            const xMove = moves[roundIdx * 2];
            const oMove = moves[roundIdx * 2 + 1];

            return (
              <div
                key={roundIdx}
                className="grid grid-cols-12 gap-1 items-center text-xs py-1 px-1.5 rounded hover:bg-stone-50 transition-colors"
              >
                {/* Round number */}
                <div className="col-span-2 font-mono text-[11px] text-stone-400 font-medium">
                  #{roundIdx + 1}
                </div>

                {/* X Move */}
                <button
                  onClick={() => onSelectMove(roundIdx * 2)}
                  className={`col-span-5 flex items-center justify-between px-2 py-1 rounded cursor-pointer font-mono text-left transition-colors ${
                    currentMoveIndex === roundIdx * 2
                      ? 'bg-blue-100 text-blue-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="text-blue-600 font-bold mr-1">✕</span>
                  <span>{getCoordinateLabel(xMove.row, xMove.col, boardSize)}</span>
                </button>

                {/* O Move */}
                {oMove ? (
                  <button
                    onClick={() => onSelectMove(roundIdx * 2 + 1)}
                    className={`col-span-5 flex items-center justify-between px-2 py-1 rounded cursor-pointer font-mono text-left transition-colors ${
                      currentMoveIndex === roundIdx * 2 + 1
                        ? 'bg-rose-100 text-rose-900 font-bold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-rose-600 font-bold mr-1">◯</span>
                    <span>{getCoordinateLabel(oMove.row, oMove.col, boardSize)}</span>
                  </button>
                ) : (
                  <div className="col-span-5 text-stone-300 text-center font-mono">
                    ...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
