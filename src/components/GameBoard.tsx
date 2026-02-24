import { Board, CellValue } from '@/lib/game-ai';
import { cn } from '@/lib/utils';

interface Props {
  board: Board;
  winLine: number[] | null;
  onCellClick: (i: number) => void;
  disabled: boolean;
}

const CellContent = ({ value }: { value: CellValue }) => {
  if (!value) return null;
  return (
    <span className={cn(
      "text-3xl md:text-5xl font-bold transition-all duration-200 scale-0 animate-[pop_0.3s_forwards]",
      value === 'X' ? 'text-primary text-glow-primary' : 'text-accent text-glow-accent'
    )}
    style={{ fontFamily: 'var(--font-display)' }}
    >
      {value}
    </span>
  );
};

const GameBoard = ({ board, winLine, onCellClick, disabled }: Props) => (
  <div className="grid grid-cols-3 gap-2 w-[280px] md:w-[360px]">
    {board.map((cell, i) => (
      <button
        key={i}
        onClick={() => onCellClick(i)}
        disabled={disabled || cell !== null}
        className={cn(
          "aspect-square rounded-lg border-2 border-border bg-card flex items-center justify-center",
          "transition-all duration-200 hover:border-primary/50 hover:bg-muted",
          "disabled:cursor-default disabled:hover:border-border disabled:hover:bg-card",
          cell === null && !disabled && "cursor-pointer hover:glow-primary",
          winLine?.includes(i) && "border-accent bg-accent/10 glow-accent"
        )}
      >
        <CellContent value={cell} />
      </button>
    ))}
    <style>{`
      @keyframes pop {
        0% { transform: scale(0); opacity: 0; }
        70% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>
  </div>
);

export default GameBoard;
