/**
 * Types definition for Cờ Caro (Gomoku) Web Application
 */

export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[][];

export interface Move {
  row: number;
  col: number;
  player: Player;
  moveNumber: number;
  timestamp: number;
}

export type GameMode = 'PVP' | 'AI';
export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'master';
export type RuleSet = 'vietnam' | 'freestyle';
export type BoardSize = 15 | 19;
export type BoardTheme = 'wood' | 'paper' | 'slate';
export type TimerMode = 0 | 15 | 30 | 60; // seconds per turn, 0 = unlimited

export interface WinningInfo {
  winner: Player;
  line: [number, number][];
  ruleNotes?: string;
}

export type GameStatus = 'PLAYING' | 'WON' | 'DRAW';

export interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
  totalGames: number;
  streak: number;
}

export interface HintResult {
  row: number;
  col: number;
  score: number;
  explanation: string;
}
