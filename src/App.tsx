/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Player,
  Board,
  Move,
  GameMode,
  AIDifficulty,
  RuleSet,
  BoardSize,
  BoardTheme,
  TimerMode,
  WinningInfo,
  GameStatus,
  GameStats,
} from './types/caro';
import {
  createEmptyBoard,
  checkWin,
  isBoardFull,
  findBestMove,
  getTacticalHint,
} from './utils/caroEngine';
import { soundManager } from './utils/sound';
import { Header } from './components/Header';
import { Scoreboard } from './components/Scoreboard';
import { CaroBoard } from './components/CaroBoard';
import { GameControls } from './components/GameControls';
import { MoveHistory } from './components/MoveHistory';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';

const STATS_STORAGE_KEY = 'caro_game_stats_v1';

export default function App() {
  // Game Settings
  const [boardSize, setBoardSize] = useState<BoardSize>(15);
  const [theme, setTheme] = useState<BoardTheme>('wood');
  const [gameMode, setGameMode] = useState<GameMode>('AI');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('hard');
  const [ruleSet, setRuleSet] = useState<RuleSet>('vietnam');
  const [timerMode, setTimerMode] = useState<TimerMode>(0);
  const [showMoveNumbers, setShowMoveNumbers] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getIsMuted());

  // Game Play State
  const [board, setBoard] = useState<Board>(() => createEmptyBoard(15));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [status, setStatus] = useState<GameStatus>('PLAYING');
  const [winningInfo, setWinningInfo] = useState<WinningInfo | null>(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [redoStack, setRedoStack] = useState<Move[]>([]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [hintCoords, setHintCoords] = useState<[number, number] | null>(null);
  const [hintExplanation, setHintExplanation] = useState<string | null>(null);
  const [turnTimeLeft, setTurnTimeLeft] = useState<number | null>(null);

  // Modals
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Statistics
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return { xWins: 0, oWins: 0, draws: 0, totalGames: 0, streak: 0 };
  });

  const saveStats = (newStats: GameStats) => {
    setStats(newStats);
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
    } catch {
      // Ignore
    }
  };

  const handleResetStats = () => {
    const emptyStats = { xWins: 0, oWins: 0, draws: 0, totalGames: 0, streak: 0 };
    saveStats(emptyStats);
  };

  // Reset/Start New Game
  const startNewGame = useCallback(
    (newSize?: BoardSize) => {
      const targetSize = newSize ?? boardSize;
      setBoard(createEmptyBoard(targetSize));
      setCurrentPlayer('X');
      setStatus('PLAYING');
      setWinningInfo(null);
      setMoves([]);
      setRedoStack([]);
      setIsAiThinking(false);
      setHintCoords(null);
      setHintExplanation(null);
      setIsGameOverModalOpen(false);
      setTurnTimeLeft(timerMode > 0 ? timerMode : null);
    },
    [boardSize, timerMode]
  );

  // Handle board size change
  const handleSetBoardSize = (size: BoardSize) => {
    if (size !== boardSize) {
      setBoardSize(size);
      startNewGame(size);
    }
  };

  // Handle Turn Timer
  useEffect(() => {
    if (timerMode === 0 || status !== 'PLAYING') {
      setTurnTimeLeft(null);
      return;
    }

    setTurnTimeLeft(timerMode);
    const interval = setInterval(() => {
      setTurnTimeLeft((prev) => {
        if (prev === null) return timerMode;
        if (prev <= 1) {
          // Timeout! Opponent wins
          const loser = currentPlayer;
          const winner: Player = loser === 'X' ? 'O' : 'X';
          setStatus('WON');
          setWinningInfo({
            winner,
            line: [],
            ruleNotes: `Quân ${loser} hết thời gian suy nghĩ! Quân ${winner} chiến thắng`,
          });
          setIsGameOverModalOpen(true);
          soundManager.playWinSound();

          // Update stats
          const newStats = {
            ...stats,
            totalGames: stats.totalGames + 1,
            xWins: winner === 'X' ? stats.xWins + 1 : stats.xWins,
            oWins: winner === 'O' ? stats.oWins + 1 : stats.oWins,
            streak: (gameMode === 'AI' && winner === 'X') ? stats.streak + 1 : 0,
          };
          saveStats(newStats);
          return 0;
        }

        if (prev <= 5) {
          soundManager.playTickSound();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayer, timerMode, status, gameMode]);

  // Execute Move
  const makeMove = useCallback(
    (row: number, col: number, player: Player) => {
      if (board[row][col] !== null || status !== 'PLAYING') return;

      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = player;
      setBoard(newBoard);

      soundManager.playStoneSound(player === 'O');

      const newMove: Move = {
        row,
        col,
        player,
        moveNumber: moves.length + 1,
        timestamp: Date.now(),
      };
      setMoves((prev) => [...prev, newMove]);
      setRedoStack([]); // Clear redo after fresh move

      // Reset hint
      setHintCoords(null);
      setHintExplanation(null);

      // Check for Win
      const win = checkWin(newBoard, row, col, player, ruleSet);
      if (win) {
        setStatus('WON');
        setWinningInfo(win);
        soundManager.playWinSound();
        setIsGameOverModalOpen(true);

        const newStats = {
          ...stats,
          totalGames: stats.totalGames + 1,
          xWins: player === 'X' ? stats.xWins + 1 : stats.xWins,
          oWins: player === 'O' ? stats.oWins + 1 : stats.oWins,
          streak: (gameMode === 'AI' && player === 'X') ? stats.streak + 1 : 0,
        };
        saveStats(newStats);
        return;
      }

      // Check for Draw
      if (isBoardFull(newBoard)) {
        setStatus('DRAW');
        soundManager.playDrawSound();
        setIsGameOverModalOpen(true);

        const newStats = {
          ...stats,
          totalGames: stats.totalGames + 1,
          draws: stats.draws + 1,
          streak: 0,
        };
        saveStats(newStats);
        return;
      }

      // Switch turn
      const nextPlayer: Player = player === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);
    },
    [board, status, moves.length, ruleSet, stats, gameMode]
  );

  // Trigger AI Turn
  useEffect(() => {
    if (gameMode !== 'AI' || currentPlayer !== 'O' || status !== 'PLAYING') {
      return;
    }

    setIsAiThinking(true);
    const thinkTimer = setTimeout(() => {
      const best = findBestMove(board, 'O', aiDifficulty, ruleSet);
      setIsAiThinking(false);
      makeMove(best.row, best.col, 'O');
    }, 380);

    return () => clearTimeout(thinkTimer);
  }, [gameMode, currentPlayer, status, board, aiDifficulty, ruleSet, makeMove]);

  // Click on cell
  const handleCellClick = (row: number, col: number) => {
    if (status !== 'PLAYING') return;
    if (gameMode === 'AI' && currentPlayer === 'O') return; // AI is thinking
    makeMove(row, col, currentPlayer);
  };

  // Undo Move
  const handleUndo = () => {
    if (moves.length === 0 || status !== 'PLAYING') return;

    soundManager.playUndoSound();
    const countToUndo = gameMode === 'AI' && moves.length >= 2 ? 2 : 1;
    const undoneMoves = moves.slice(-countToUndo);
    const remainingMoves = moves.slice(0, -countToUndo);

    // Reconstruct board
    const newBoard = createEmptyBoard(boardSize);
    remainingMoves.forEach((m) => {
      newBoard[m.row][m.col] = m.player;
    });

    setBoard(newBoard);
    setMoves(remainingMoves);
    setRedoStack((prev) => [...undoneMoves.reverse(), ...prev]);
    setCurrentPlayer(remainingMoves.length % 2 === 0 ? 'X' : 'O');
    setHintCoords(null);
    setHintExplanation(null);
  };

  // Redo Move
  const handleRedo = () => {
    if (redoStack.length === 0 || status !== 'PLAYING') return;

    soundManager.playUndoSound();
    const countToRedo = gameMode === 'AI' && redoStack.length >= 2 ? 2 : 1;
    const movesToApply = redoStack.slice(0, countToRedo);
    const newRedoStack = redoStack.slice(countToRedo);

    const newBoard = board.map((r) => [...r]);
    movesToApply.forEach((m) => {
      newBoard[m.row][m.col] = m.player;
    });

    setBoard(newBoard);
    setMoves((prev) => [...prev, ...movesToApply]);
    setRedoStack(newRedoStack);
    setCurrentPlayer((moves.length + countToRedo) % 2 === 0 ? 'X' : 'O');
  };

  // Tactical Hint
  const handleGetHint = () => {
    if (status !== 'PLAYING' || isAiThinking) return;
    soundManager.playHintSound();
    const hint = getTacticalHint(board, currentPlayer, ruleSet);
    setHintCoords([hint.row, hint.col]);
    setHintExplanation(hint.explanation);
  };

  // Resign
  const handleResign = () => {
    if (status !== 'PLAYING') return;
    const winner: Player = currentPlayer === 'X' ? 'O' : 'X';
    setStatus('WON');
    setWinningInfo({
      winner,
      line: [],
      ruleNotes: `Quân ${currentPlayer} xin đầu hàng! Quân ${winner} chiến thắng`,
    });
    setIsGameOverModalOpen(true);
    soundManager.playWinSound();

    const newStats = {
      ...stats,
      totalGames: stats.totalGames + 1,
      xWins: winner === 'X' ? stats.xWins + 1 : stats.xWins,
      oWins: winner === 'O' ? stats.oWins + 1 : stats.oWins,
      streak: 0,
    };
    saveStats(newStats);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Map moves for number display
  const movesMap = useMemo(() => {
    const map = new Map<string, number>();
    moves.forEach((m) => {
      map.set(`${m.row},${m.col}`, m.moveNumber);
    });
    return map;
  }, [moves]);

  const lastMove = moves.length > 0 ? moves[moves.length - 1] : null;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900">
      {/* Top Bar */}
      <Header
        onNewGame={() => startNewGame()}
        onOpenRules={() => setIsRulesModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Game Arena Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 py-4 md:py-6 flex flex-col">
        {/* Scoreboard */}
        <Scoreboard
          currentPlayer={currentPlayer}
          status={status}
          gameMode={gameMode}
          aiDifficulty={aiDifficulty}
          stats={stats}
          turnTimeLeft={turnTimeLeft}
          timerMode={timerMode}
          isAiThinking={isAiThinking}
        />

        {/* 2-Column Split: Board on Left/Center, Controls & History on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start flex-1">
          {/* Caro Board (8 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center">
            <CaroBoard
              board={board}
              size={boardSize}
              theme={theme}
              currentPlayer={currentPlayer}
              onCellClick={handleCellClick}
              lastMove={lastMove}
              winningInfo={winningInfo}
              showMoveNumbers={showMoveNumbers}
              movesMap={movesMap}
              hintCoords={hintCoords}
              isInteractive={status === 'PLAYING' && !(gameMode === 'AI' && currentPlayer === 'O')}
            />
          </div>

          {/* Right Sidebar: Controls & Move Notation (4 cols on desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <GameControls
              gameMode={gameMode}
              onSetGameMode={(m) => {
                setGameMode(m);
                startNewGame();
              }}
              aiDifficulty={aiDifficulty}
              onSetAiDifficulty={setAiDifficulty}
              ruleSet={ruleSet}
              onSetRuleSet={setRuleSet}
              boardSize={boardSize}
              onSetBoardSize={handleSetBoardSize}
              timerMode={timerMode}
              onSetTimerMode={setTimerMode}
              canUndo={moves.length > 0 && status === 'PLAYING'}
              onUndo={handleUndo}
              canRedo={redoStack.length > 0 && status === 'PLAYING'}
              onRedo={handleRedo}
              onGetHint={handleGetHint}
              showMoveNumbers={showMoveNumbers}
              onToggleMoveNumbers={() => setShowMoveNumbers((prev) => !prev)}
              onResign={handleResign}
              hintExplanation={hintExplanation}
              isPlaying={status === 'PLAYING'}
            />

            <MoveHistory
              moves={moves}
              boardSize={boardSize}
              currentMoveIndex={moves.length - 1}
              onSelectMove={() => {}}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <GameOverModal
        isOpen={isGameOverModalOpen}
        winner={winningInfo?.winner ?? null}
        winningInfo={winningInfo}
        gameMode={gameMode}
        aiDifficulty={aiDifficulty}
        stats={stats}
        totalMoves={moves.length}
        onPlayAgain={() => startNewGame()}
        onClose={() => setIsGameOverModalOpen(false)}
      />

      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        theme={theme}
        onSetTheme={setTheme}
        boardSize={boardSize}
        onSetBoardSize={handleSetBoardSize}
        timerMode={timerMode}
        onSetTimerMode={setTimerMode}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onResetStats={handleResetStats}
      />
    </div>
  );
}
