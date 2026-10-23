import React, { useRef, useState, useEffect } from 'react';
import { Board, Cell, Player, WinningInfo, BoardSize, BoardTheme } from '../types/caro';
import { getStarPoints, BOARD_COLS } from '../utils/caroEngine';
import { ZoomIn, ZoomOut, Maximize2, Lightbulb } from 'lucide-react';

interface CaroBoardProps {
  board: Board;
  size: BoardSize;
  theme: BoardTheme;
  currentPlayer: Player;
  onCellClick: (row: number, col: number) => void;
  lastMove: { row: number; col: number; player: Player } | null;
  winningInfo: WinningInfo | null;
  showMoveNumbers: boolean;
  movesMap: Map<string, number>; // "r,c" -> moveNumber
  hintCoords: [number, number] | null;
  isInteractive: boolean;
}

export const CaroBoard: React.FC<CaroBoardProps> = ({
  board,
  size,
  theme,
  currentPlayer,
  onCellClick,
  lastMove,
  winningInfo,
  showMoveNumbers,
  movesMap,
  hintCoords,
  isInteractive,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);

  // Reset zoom if size changes
  useEffect(() => {
    setZoomScale(1);
  }, [size]);

  const starPoints = getStarPoints(size);
  const isStarPoint = (r: number, c: number) => {
    return starPoints.some(([sr, sc]) => sr === r && sc === c);
  };

  const winningSet = new Set<string>();
  if (winningInfo?.line) {
    winningInfo.line.forEach(([r, c]) => winningSet.add(`${r},${c}`));
  }

  // Cell size calculation: For 15x15, ~36-40px is ideal, for 19x19 ~32-36px
  const baseCellSize = size === 15 ? 38 : 34;
  const cellSize = Math.round(baseCellSize * zoomScale);

  // Background style based on theme
  const getThemeBackground = () => {
    if (theme === 'wood') {
      return {
        backgroundImage: `linear-gradient(rgba(217, 119, 6, 0.08), rgba(180, 83, 9, 0.15)), url('/src/assets/images/caro_wood_texture_1792721757395.jpg')`,
        backgroundSize: 'cover',
        backgroundColor: '#e7a858',
      };
    }
    if (theme === 'paper') {
      return {
        backgroundColor: '#faf6ee',
        backgroundImage: 'radial-gradient(#e5dfd3 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      };
    }
    // Slate/Dark theme
    return {
      backgroundColor: '#1e293b',
      backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
      backgroundSize: '16px 16px',
    };
  };

  const gridLineColor = theme === 'slate' ? 'rgba(148, 163, 184, 0.4)' : 'rgba(115, 65, 30, 0.65)';
  const labelColor = theme === 'slate' ? 'text-slate-400' : 'text-stone-700/80';
  const starPointColor = theme === 'slate' ? '#94a3b8' : '#653518';

  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* Board controls bar */}
      <div className="w-full max-w-[700px] flex items-center justify-between text-xs text-stone-600 mb-2 px-1">
        <div className="flex items-center gap-2">
          <span>Kích thước: <strong>{size}×{size}</strong> ô</span>
          <span>·</span>
          <span>Điểm thắng: <strong>5 quân liên tiếp</strong></span>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-stone-200/80 rounded-lg p-1 shadow-xs">
          <button
            onClick={() => setZoomScale((prev) => Math.max(0.75, prev - 0.1))}
            title="Thu nhỏ"
            className="p-1.5 hover:bg-stone-100 rounded text-stone-700 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] px-1 text-stone-600">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            onClick={() => setZoomScale((prev) => Math.min(1.4, prev + 0.1))}
            title="Phóng to"
            className="p-1.5 hover:bg-stone-100 rounded text-stone-700 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomScale(1)}
            title="Mặc định 100%"
            className="p-1.5 hover:bg-stone-100 rounded text-stone-700 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Board Scrollable Wrapper */}
      <div
        ref={containerRef}
        className="w-full overflow-auto p-2 sm:p-4 flex justify-center items-center rounded-2xl bg-stone-100/70 border border-stone-200 shadow-inner"
        style={{ maxHeight: '72vh' }}
      >
        <div
          className="relative rounded-xl shadow-xl transition-all p-5 sm:p-7 border-4 border-amber-950/20"
          style={getThemeBackground()}
        >
          {/* Top Column Labels (A, B, C...) */}
          <div
            className="grid text-center font-mono text-[11px] font-bold pb-2"
            style={{
              gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
            }}
          >
            {Array.from({ length: size }, (_, i) => (
              <div key={i} className={labelColor}>
                {BOARD_COLS[i]}
              </div>
            ))}
          </div>

          {/* Center: Grid & Row numbers */}
          <div className="flex items-center">
            {/* Left Row Labels (15, 14, 13... or 19, 18, 17...) */}
            <div
              className="flex flex-col text-right font-mono text-[11px] font-bold pr-2.5"
              style={{ height: size * cellSize }}
            >
              {Array.from({ length: size }, (_, r) => (
                <div
                  key={r}
                  className={`flex items-center justify-end ${labelColor}`}
                  style={{ height: cellSize }}
                >
                  {size - r}
                </div>
              ))}
            </div>

            {/* Grid Field */}
            <div
              className="relative"
              style={{
                width: size * cellSize,
                height: size * cellSize,
              }}
              onMouseLeave={() => setHoveredCell(null)}
            >
              {/* SVG Grid Lines & Star Points */}
              <svg
                className="absolute inset-0 pointer-events-none"
                width={size * cellSize}
                height={size * cellSize}
              >
                {/* Horizontal lines */}
                {Array.from({ length: size }, (_, i) => {
                  const y = i * cellSize + cellSize / 2;
                  return (
                    <line
                      key={`h-${i}`}
                      x1={cellSize / 2}
                      y1={y}
                      x2={size * cellSize - cellSize / 2}
                      y2={y}
                      stroke={gridLineColor}
                      strokeWidth={i === 0 || i === size - 1 ? 2 : 1.2}
                    />
                  );
                })}

                {/* Vertical lines */}
                {Array.from({ length: size }, (_, i) => {
                  const x = i * cellSize + cellSize / 2;
                  return (
                    <line
                      key={`v-${i}`}
                      x1={x}
                      y1={cellSize / 2}
                      x2={x}
                      y2={size * cellSize - cellSize / 2}
                      stroke={gridLineColor}
                      strokeWidth={i === 0 || i === size - 1 ? 2 : 1.2}
                    />
                  );
                })}

                {/* Star points (Hoshi) */}
                {starPoints.map(([sr, sc], idx) => {
                  const cx = sc * cellSize + cellSize / 2;
                  const cy = sr * cellSize + cellSize / 2;
                  return (
                    <circle
                      key={`star-${idx}`}
                      cx={cx}
                      cy={cy}
                      r={3.5 * zoomScale}
                      fill={starPointColor}
                    />
                  );
                })}
              </svg>

              {/* Interactive Cells Grid */}
              <div
                className="grid absolute inset-0"
                style={{
                  gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
                  gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
                }}
              >
                {board.map((rowArr, r) =>
                  rowArr.map((cell, c) => {
                    const isHovered =
                      isInteractive &&
                      hoveredCell &&
                      hoveredCell[0] === r &&
                      hoveredCell[1] === c &&
                      cell === null;
                    const isLast =
                      lastMove && lastMove.row === r && lastMove.col === c;
                    const isWin = winningSet.has(`${r},${c}`);
                    const isHint =
                      hintCoords &&
                      hintCoords[0] === r &&
                      hintCoords[1] === c &&
                      cell === null;
                    const moveNum = movesMap.get(`${r},${c}`);

                    return (
                      <button
                        key={`${r}-${c}`}
                        type="button"
                        onClick={() => {
                          if (isInteractive && cell === null) {
                            onCellClick(r, c);
                          }
                        }}
                        onMouseEnter={() => {
                          if (isInteractive && cell === null) {
                            setHoveredCell([r, c]);
                          }
                        }}
                        disabled={!isInteractive || cell !== null}
                        className={`relative flex items-center justify-center p-0 cursor-pointer focus:outline-none transition-transform ${
                          cell === null && isInteractive ? 'hover:scale-105' : ''
                        }`}
                        style={{
                          width: cellSize,
                          height: cellSize,
                        }}
                        aria-label={`Ô ${BOARD_COLS[c]}${size - r}`}
                      >
                        {/* Stone Render */}
                        {cell === 'X' && (
                          <div
                            className={`rounded-full flex items-center justify-center font-bold text-white shadow-md transition-all ${
                              isWin
                                ? 'bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 ring-4 ring-cyan-300 animate-bounce'
                                : 'bg-gradient-to-tr from-blue-800 to-blue-500 border border-blue-900/40'
                            }`}
                            style={{
                              width: cellSize * 0.82,
                              height: cellSize * 0.82,
                            }}
                          >
                            <span
                              style={{
                                fontSize: cellSize * 0.44,
                                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                              }}
                            >
                              ✕
                            </span>
                            {showMoveNumbers && moveNum !== undefined && (
                              <span className="absolute -bottom-1 -right-1 bg-white/90 text-blue-900 text-[9px] font-mono px-1 rounded-full shadow-xs leading-none">
                                {moveNum}
                              </span>
                            )}
                          </div>
                        )}

                        {cell === 'O' && (
                          <div
                            className={`rounded-full flex items-center justify-center font-bold text-white shadow-md transition-all ${
                              isWin
                                ? 'bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-400 ring-4 ring-amber-300 animate-bounce'
                                : 'bg-gradient-to-tr from-rose-800 to-rose-500 border border-rose-900/40'
                            }`}
                            style={{
                              width: cellSize * 0.82,
                              height: cellSize * 0.82,
                            }}
                          >
                            <span
                              style={{
                                fontSize: cellSize * 0.44,
                                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                              }}
                            >
                              ◯
                            </span>
                            {showMoveNumbers && moveNum !== undefined && (
                              <span className="absolute -bottom-1 -right-1 bg-white/90 text-rose-900 text-[9px] font-mono px-1 rounded-full shadow-xs leading-none">
                                {moveNum}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Last Move Outer Halo */}
                        {isLast && (
                          <span
                            className="absolute pointer-events-none rounded-full border-2 border-amber-300 animate-ping opacity-75"
                            style={{
                              width: cellSize * 0.95,
                              height: cellSize * 0.95,
                            }}
                          />
                        )}

                        {/* Hint Indicator */}
                        {isHint && (
                          <div
                            className="absolute pointer-events-none rounded-full bg-amber-400/30 border-2 border-amber-500 animate-pulse flex items-center justify-center shadow-lg"
                            style={{
                              width: cellSize * 0.75,
                              height: cellSize * 0.75,
                            }}
                          >
                            <Lightbulb className="w-3 h-3 text-amber-700 animate-bounce" />
                          </div>
                        )}

                        {/* Hover Ghost Stone */}
                        {isHovered && !isHint && (
                          <div
                            className={`rounded-full flex items-center justify-center font-bold opacity-45 pointer-events-none ${
                              currentPlayer === 'X'
                                ? 'bg-blue-600 text-white'
                                : 'bg-rose-600 text-white'
                            }`}
                            style={{
                              width: cellSize * 0.78,
                              height: cellSize * 0.78,
                            }}
                          >
                            <span style={{ fontSize: cellSize * 0.4 }}>
                              {currentPlayer === 'X' ? '✕' : '◯'}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Row Labels */}
            <div
              className="flex flex-col text-left font-mono text-[11px] font-bold pl-2.5"
              style={{ height: size * cellSize }}
            >
              {Array.from({ length: size }, (_, r) => (
                <div
                  key={r}
                  className={`flex items-center justify-start ${labelColor}`}
                  style={{ height: cellSize }}
                >
                  {size - r}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Column Labels */}
          <div
            className="grid text-center font-mono text-[11px] font-bold pt-2"
            style={{
              gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
            }}
          >
            {Array.from({ length: size }, (_, i) => (
              <div key={i} className={labelColor}>
                {BOARD_COLS[i]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
