import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Board, Difficulty, checkWinner, isBoardFull, getAIMove } from '@/lib/game-ai';
import GameBoard from '@/components/GameBoard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Info, RotateCcw, Users, Monitor } from 'lucide-react';

type Mode = 'ai' | 'pvp';

const EMPTY_BOARD: Board = Array(9).fill(null);

const Game = () => {
  const [mode, setMode] = useState<Mode>('ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [board, setBoard] = useState<Board>([...EMPTY_BOARD]);
  const [isXTurn, setIsXTurn] = useState(true);
  const [score, setScore] = useState({ x: 0, o: 0, draw: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [status, setStatus] = useState('Your turn (X)');

  const reset = useCallback(() => {
    setBoard([...EMPTY_BOARD]);
    setIsXTurn(true);
    setGameOver(false);
    setWinLine(null);
    setStatus(mode === 'ai' ? 'Your turn (X)' : "Player X's turn");
  }, [mode]);

  const handleResult = useCallback((newBoard: Board) => {
    const { winner, line } = checkWinner(newBoard);
    if (winner) {
      setWinLine(line);
      setGameOver(true);
      setScore(s => ({ ...s, [winner.toLowerCase()]: s[winner.toLowerCase() as 'x' | 'o'] + 1 }));
      setStatus(mode === 'ai'
        ? (winner === 'X' ? '🎉 You win!' : '🤖 AI wins!')
        : `🎉 Player ${winner} wins!`);
      return true;
    }
    if (isBoardFull(newBoard)) {
      setGameOver(true);
      setScore(s => ({ ...s, draw: s.draw + 1 }));
      setStatus("It's a draw!");
      return true;
    }
    return false;
  }, [mode]);

  // AI move
  useEffect(() => {
    if (mode !== 'ai' || isXTurn || gameOver) return;
    setStatus('🤖 AI thinking...');
    const timer = setTimeout(() => {
      const move = getAIMove(board, difficulty);
      const newBoard = [...board];
      newBoard[move] = 'O';
      setBoard(newBoard);
      if (!handleResult(newBoard)) {
        setIsXTurn(true);
        setStatus('Your turn (X)');
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [isXTurn, gameOver, mode, board, difficulty, handleResult]);

  const handleCellClick = (i: number) => {
    if (gameOver || board[i]) return;
    if (mode === 'ai' && !isXTurn) return;

    const newBoard = [...board];
    newBoard[i] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);

    if (!handleResult(newBoard)) {
      setIsXTurn(!isXTurn);
      if (mode === 'pvp') setStatus(`Player ${isXTurn ? 'O' : 'X'}'s turn`);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setScore({ x: 0, o: 0, draw: 0 });
    setBoard([...EMPTY_BOARD]);
    setIsXTurn(true);
    setGameOver(false);
    setWinLine(null);
    setStatus(m === 'ai' ? 'Your turn (X)' : "Player X's turn");
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-background">
      <h1 className="text-xl md:text-2xl text-primary text-glow-primary mb-6 tracking-wider">
        TIC TAC TOE
      </h1>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={mode === 'ai' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchMode('ai')}
          className={cn(mode === 'ai' && 'glow-primary')}
        >
          <Monitor className="w-4 h-4 mr-1" /> vs AI
        </Button>
        <Button
          variant={mode === 'pvp' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchMode('pvp')}
          className={cn(mode === 'pvp' && 'glow-primary')}
        >
          <Users className="w-4 h-4 mr-1" /> 2 Player
        </Button>
      </div>

      {/* Difficulty (AI mode) */}
      {mode === 'ai' && (
        <div className="flex gap-2 mb-6">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => { setDifficulty(d); reset(); }}
              className={cn(
                "px-3 py-1 rounded-md text-xs uppercase tracking-wider border transition-all",
                difficulty === d
                  ? 'border-accent text-accent glow-accent bg-accent/10'
                  : 'border-border text-muted-foreground hover:border-muted-foreground'
              )}
              style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem' }}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Status */}
      <p className="text-sm text-foreground mb-4 h-6" style={{ fontFamily: 'var(--font-body)' }}>
        {status}
      </p>

      <GameBoard board={board} winLine={winLine} onCellClick={handleCellClick} disabled={gameOver || (mode === 'ai' && !isXTurn)} />

      {/* Score */}
      <div className="flex gap-6 mt-6 text-xs" style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem' }}>
        <div className="text-center">
          <div className="text-primary text-glow-primary">X</div>
          <div className="text-foreground text-lg mt-1" style={{ fontFamily: 'var(--font-body)' }}>{score.x}</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">DRAW</div>
          <div className="text-foreground text-lg mt-1" style={{ fontFamily: 'var(--font-body)' }}>{score.draw}</div>
        </div>
        <div className="text-center">
          <div className="text-accent text-glow-accent">O</div>
          <div className="text-foreground text-lg mt-1" style={{ fontFamily: 'var(--font-body)' }}>{score.o}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="w-4 h-4 mr-1" /> Reset
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/about"><Info className="w-4 h-4 mr-1" /> How it works</Link>
        </Button>
      </div>
    </div>
  );
};

export default Game;
