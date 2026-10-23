/**
 * Core Caro (Gomoku) game logic and AI bot engine
 */

import { Board, Cell, Player, RuleSet, WinningInfo, AIDifficulty, HintResult } from '../types/caro';

export const DIRECTIONS: [number, number][] = [
  [0, 1],   // Horizontal
  [1, 0],   // Vertical
  [1, 1],   // Diagonal down-right
  [-1, 1],  // Diagonal up-right
];

export const BOARD_COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];

/**
 * Creates an empty square board of given size
 */
export function createEmptyBoard(size: number): Board {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

/**
 * Convert [row, col] to standard chess/caro notation, e.g. [7, 7] -> "H8"
 */
export function getCoordinateLabel(row: number, col: number, boardSize: number): string {
  const colLetter = BOARD_COLS[col] || String.fromCharCode(65 + col);
  const rowNumber = boardSize - row;
  return `${colLetter}${rowNumber}`;
}

/**
 * Check if coordinates are within the board bounds
 */
export function isValidCell(row: number, col: number, size: number): boolean {
  return row >= 0 && row < size && col >= 0 && col < size;
}

/**
 * Evaluates if a move results in a win
 */
export function checkWin(
  board: Board,
  lastRow: number,
  lastCol: number,
  player: Player,
  ruleSet: RuleSet
): WinningInfo | null {
  const size = board.length;
  const opponent: Player = player === 'X' ? 'O' : 'X';

  for (const [dr, dc] of DIRECTIONS) {
    const line: [number, number][] = [[lastRow, lastCol]];

    // Scan forward
    let forwardR = lastRow + dr;
    let forwardC = lastCol + dc;
    while (isValidCell(forwardR, forwardC, size) && board[forwardR][forwardC] === player) {
      line.push([forwardR, forwardC]);
      forwardR += dr;
      forwardC += dc;
    }

    // Scan backward
    let backwardR = lastRow - dr;
    let backwardC = lastCol - dc;
    while (isValidCell(backwardR, backwardC, size) && board[backwardR][backwardC] === player) {
      line.unshift([backwardR, backwardC]);
      backwardR -= dr;
      backwardC -= dc;
    }

    const count = line.length;

    if (count >= 5) {
      if (ruleSet === 'freestyle') {
        return {
          winner: player,
          line: line.slice(0, 5),
          ruleNotes: 'Đủ 5 quân liên tiếp (Luật tự do)'
        };
      }

      // Vietnam Rule: Blocked at both ends is NOT a win
      // Check block at forward end
      const forwardBlocked = isValidCell(forwardR, forwardC, size) && board[forwardR][forwardC] === opponent;
      // Check block at backward end
      const backwardBlocked = isValidCell(backwardR, backwardC, size) && board[backwardR][backwardC] === opponent;

      if (forwardBlocked && backwardBlocked) {
        // Both ends blocked by opponent! Not a valid win in Vietnam Caro rule
        continue;
      }

      return {
        winner: player,
        line: line.slice(0, 5),
        ruleNotes: !forwardBlocked && !backwardBlocked 
          ? 'Thế 5 quân mở 2 đầu tuyệt đối' 
          : 'Thế 5 quân hợp lệ (không bị chặn 2 đầu)'
      };
    }
  }

  return null;
}

/**
 * Checks if the board is completely full (draw)
 */
export function isBoardFull(board: Board): boolean {
  return board.every(row => row.every(cell => cell !== null));
}

/**
 * Get star point (Hoshi/Tengen) positions for standard boards
 */
export function getStarPoints(size: number): [number, number][] {
  if (size === 15) {
    return [
      [3, 3], [3, 11],
      [7, 7], // Tengen
      [11, 3], [11, 11]
    ];
  }
  if (size === 19) {
    return [
      [3, 3], [3, 9], [3, 15],
      [9, 3], [9, 9], [9, 15],
      [15, 3], [15, 9], [15, 15]
    ];
  }
  const mid = Math.floor(size / 2);
  return [[mid, mid]];
}

/**
 * Identify relevant candidate moves within 2 steps of any placed stone
 */
export function getCandidateMoves(board: Board): [number, number][] {
  const size = board.length;
  const candidates = new Set<string>();
  let hasStones = false;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== null) {
        hasStones = true;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (isValidCell(nr, nc, size) && board[nr][nc] === null) {
              candidates.add(`${nr},${nc}`);
            }
          }
        }
      }
    }
  }

  if (!hasStones) {
    const center = Math.floor(size / 2);
    return [[center, center]];
  }

  const result: [number, number][] = [];
  for (const key of candidates) {
    const [r, c] = key.split(',').map(Number);
    result.push([r, c]);
  }
  return result;
}

/**
 * Evaluate single line pattern starting from a point in one direction
 */
function evaluateLine(
  board: Board,
  r: number,
  c: number,
  dr: number,
  dc: number,
  player: Player,
  ruleSet: RuleSet
): number {
  const size = board.length;
  const opponent: Player = player === 'X' ? 'O' : 'X';

  let count = 1;
  let openEnds = 0;

  // Forward
  let fr = r + dr;
  let fc = c + dc;
  while (isValidCell(fr, fc, size) && board[fr][fc] === player) {
    count++;
    fr += dr;
    fc += dc;
  }
  if (isValidCell(fr, fc, size) && board[fr][fc] === null) {
    openEnds++;
  }

  // Backward
  let br = r - dr;
  let bc = c - dc;
  while (isValidCell(br, bc, size) && board[br][bc] === player) {
    count++;
    br -= dr;
    bc -= dc;
  }
  if (isValidCell(br, bc, size) && board[br][bc] === null) {
    openEnds++;
  }

  // Check Vietnam rule: blocked at both ends with opponent
  const fOpp = isValidCell(fr, fc, size) && board[fr][fc] === opponent;
  const bOpp = isValidCell(br, bc, size) && board[br][bc] === opponent;
  const bothBlocked = fOpp && bOpp;

  if (count >= 5) {
    if (ruleSet === 'vietnam' && bothBlocked) return 500;
    return 10000000;
  }

  if (count === 4) {
    if (openEnds === 2) return 1000000;
    if (openEnds === 1 && !bothBlocked) return 80000;
    return 100;
  }

  if (count === 3) {
    if (openEnds === 2) return 40000;
    if (openEnds === 1 && !bothBlocked) return 4000;
    return 50;
  }

  if (count === 2) {
    if (openEnds === 2) return 1200;
    if (openEnds === 1) return 200;
    return 10;
  }

  if (count === 1) {
    if (openEnds === 2) return 20;
    return 5;
  }

  return 0;
}

/**
 * Score a single point for a player (offensive or defensive value)
 */
export function scorePoint(
  board: Board,
  r: number,
  c: number,
  player: Player,
  ruleSet: RuleSet
): number {
  let total = 0;
  // Center proximity bonus
  const size = board.length;
  const center = size / 2;
  const dist = Math.abs(r - center) + Math.abs(c - center);
  total += Math.max(0, 16 - dist);

  for (const [dr, dc] of DIRECTIONS) {
    total += evaluateLine(board, r, c, dr, dc, player, ruleSet);
  }
  return total;
}

/**
 * Find the optimal move for AI or Hint
 */
export function findBestMove(
  board: Board,
  aiPlayer: Player,
  difficulty: AIDifficulty,
  ruleSet: RuleSet
): { row: number; col: number; score: number; explanation: string } {
  const size = board.length;
  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const candidates = getCandidateMoves(board);

  if (candidates.length === 1) {
    return {
      row: candidates[0][0],
      col: candidates[0][1],
      score: 100,
      explanation: 'Nước khai cuộc chiến lược tại trung tâm bàn cờ'
    };
  }

  // Easy mode: random with instant check for immediate winning/blocking moves
  if (difficulty === 'easy') {
    // 30% chance to make an intelligent move, 70% random candidate
    const isClever = Math.random() < 0.35;
    if (!isClever) {
      const randomIdx = Math.floor(Math.random() * candidates.length);
      const [r, c] = candidates[randomIdx];
      return {
        row: r,
        col: c,
        score: 10,
        explanation: 'Nước đi ngẫu nhiên cấp độ Tập sự'
      };
    }
  }

  // Evaluate candidate moves
  const scoredMoves: { row: number; col: number; score: number; attackScore: number; defendScore: number; reason: string }[] = [];

  for (const [r, c] of candidates) {
    const attack = scorePoint(board, r, c, aiPlayer, ruleSet);
    const defend = scorePoint(board, r, c, humanPlayer, ruleSet);

    // Master / Hard weighting
    let combinedScore = 0;
    let reason = 'Phát triển thế cờ liên kết';

    if (attack >= 10000000) {
      combinedScore = 20000000;
      reason = 'Nước cờ kết liễu trận đấu! Hoàn thành 5 quân';
    } else if (defend >= 10000000) {
      combinedScore = 15000000;
      reason = 'Khẩn cấp! Chặn đối phương thắng ở nước tiếp theo';
    } else if (attack >= 1000000) {
      combinedScore = 8000000;
      reason = 'Tạo thế 4 hở 2 đầu nắm chắc chiến thắng';
    } else if (defend >= 1000000) {
      combinedScore = 6000000;
      reason = 'Chặn ngay thế 4 hở của đối phương';
    } else if (attack >= 80000) {
      combinedScore = 3000000;
      reason = 'Tạo nước cờ 4 bắt buộc đối phương phải đỡ';
    } else if (defend >= 80000) {
      combinedScore = 2500000;
      reason = 'Chặn nước cờ 4 nguy hiểm của đối thủ';
    } else if (attack >= 40000 && defend >= 40000) {
      combinedScore = 1800000;
      reason = 'Điểm giao tranh then chốt: Vừa tạo thế 3 vừa bẻ gãy đòn tấn công đối thủ';
    } else if (defend >= 40000) {
      combinedScore = difficulty === 'medium' ? defend * 1.1 : defend * 1.35;
      reason = 'Phòng thủ chặn thế 3 mở rộng của đối thủ';
    } else {
      // Dynamic balance between aggression and defense
      const defFactor = difficulty === 'master' ? 1.25 : 1.1;
      combinedScore = attack + defend * defFactor;
    }

    scoredMoves.push({
      row: r,
      col: c,
      score: combinedScore,
      attackScore: attack,
      defendScore: defend,
      reason
    });
  }

  // Sort descending
  scoredMoves.sort((a, b) => b.score - a.score);

  if (difficulty === 'medium' && scoredMoves.length > 2) {
    // Medium picks among top 3 moves to feel natural without being superhuman
    const topN = Math.min(3, scoredMoves.length);
    const pickIdx = Math.floor(Math.random() * topN);
    const chosen = scoredMoves[pickIdx];
    return {
      row: chosen.row,
      col: chosen.col,
      score: chosen.score,
      explanation: chosen.reason
    };
  }

  const best = scoredMoves[0];
  return {
    row: best.row,
    col: best.col,
    score: best.score,
    explanation: best.reason
  };
}

/**
 * Provides a strategic hint for the human player
 */
export function getTacticalHint(
  board: Board,
  currentPlayer: Player,
  ruleSet: RuleSet
): HintResult {
  const result = findBestMove(board, currentPlayer, 'master', ruleSet);
  const coord = getCoordinateLabel(result.row, result.col, board.length);
  return {
    row: result.row,
    col: result.col,
    score: result.score,
    explanation: `Gợi ý ô ${coord}: ${result.explanation}`
  };
}
