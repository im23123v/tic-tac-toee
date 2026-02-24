export type CellValue = 'X' | 'O' | null;
export type Board = CellValue[];
export type Difficulty = 'easy' | 'medium' | 'hard';

export const checkWinner = (board: Board): { winner: CellValue; line: number[] | null } => {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a,b,c] };
    }
  }
  return { winner: null, line: null };
};

export const isBoardFull = (board: Board) => board.every(c => c !== null);

const getEmpty = (board: Board) => board.reduce<number[]>((a, c, i) => c === null ? [...a, i] : a, []);

const minimax = (board: Board, isMax: boolean): number => {
  const { winner } = checkWinner(board);
  if (winner === 'O') return 10;
  if (winner === 'X') return -10;
  if (isBoardFull(board)) return 0;

  const empty = getEmpty(board);
  if (isMax) {
    let best = -Infinity;
    for (const i of empty) {
      board[i] = 'O';
      best = Math.max(best, minimax(board, false));
      board[i] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (const i of empty) {
      board[i] = 'X';
      best = Math.min(best, minimax(board, true));
      board[i] = null;
    }
    return best;
  }
};

const getBestMove = (board: Board): number => {
  let bestVal = -Infinity;
  let bestMove = -1;
  for (const i of getEmpty(board)) {
    board[i] = 'O';
    const val = minimax(board, false);
    board[i] = null;
    if (val > bestVal) { bestVal = val; bestMove = i; }
  }
  return bestMove;
};

const getMediumMove = (board: Board): number => {
  // 60% chance of best move, 40% random
  if (Math.random() < 0.6) return getBestMove(board);
  const empty = getEmpty(board);
  return empty[Math.floor(Math.random() * empty.length)];
};

const getEasyMove = (board: Board): number => {
  const empty = getEmpty(board);
  return empty[Math.floor(Math.random() * empty.length)];
};

export const getAIMove = (board: Board, difficulty: Difficulty): number => {
  const copy = [...board];
  switch (difficulty) {
    case 'easy': return getEasyMove(copy);
    case 'medium': return getMediumMove(copy);
    case 'hard': return getBestMove(copy);
  }
};
