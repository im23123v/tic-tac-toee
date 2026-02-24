import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-sm text-primary text-glow-primary mb-3 tracking-wider">{title}</h2>
    <div className="text-sm text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

const About = () => (
  <div className="min-h-screen bg-background px-4 py-8 max-w-2xl mx-auto">
    <Button variant="outline" size="sm" asChild className="mb-8">
      <Link to="/"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Game</Link>
    </Button>

    <h1 className="text-xl md:text-2xl text-primary text-glow-primary mb-8 tracking-wider">
      HOW IT WORKS
    </h1>

    <Section title="THE GAME">
      <p>Tic Tac Toe is a two-player game on a 3×3 grid. Players alternate placing X or O. The first to get three in a row (horizontal, vertical, or diagonal) wins. If all 9 cells are filled with no winner, it's a draw.</p>
      <p>The game has 255,168 possible game sequences, but only 138 unique terminal board positions when accounting for symmetry.</p>
    </Section>

    <Section title="GAME MODES">
      <p><span className="text-primary">vs AI</span> — Play against the computer with three difficulty levels.</p>
      <p><span className="text-accent">2 Player</span> — Play locally against a friend, taking turns on the same device.</p>
    </Section>

    <Section title="AI: EASY MODE — RANDOM">
      <p>The AI picks a random empty cell. No strategy at all — purely random moves. Great for beginners or casual play.</p>
      <p className="text-xs border border-border rounded-lg p-3 bg-card font-mono">
        move = randomChoice(emptyCells)
      </p>
    </Section>

    <Section title="AI: MEDIUM MODE — HEURISTIC + RANDOM">
      <p>The AI uses the optimal Minimax move 60% of the time and a random move 40% of the time. This creates a beatable but challenging opponent.</p>
      <p className="text-xs border border-border rounded-lg p-3 bg-card font-mono">
        if random() &lt; 0.6:<br />
        &nbsp;&nbsp;move = minimax(board)<br />
        else:<br />
        &nbsp;&nbsp;move = randomChoice(emptyCells)
      </p>
    </Section>

    <Section title="AI: HARD MODE — MINIMAX ALGORITHM">
      <p>The Minimax algorithm is a recursive decision-making algorithm used in two-player zero-sum games. It explores every possible future game state to find the optimal move.</p>
      <p><span className="text-accent">How it works:</span> The algorithm builds a game tree of all possible moves. It assumes the opponent plays optimally. At each level, the maximizing player (AI) picks the move with the highest score, while the minimizing player (human) picks the lowest.</p>
      <p><span className="text-accent">Scoring:</span> AI win = +10, Human win = −10, Draw = 0. The algorithm always finds the best possible outcome.</p>
      <p className="text-xs border border-border rounded-lg p-3 bg-card font-mono">
        function minimax(board, isMaximizing):<br />
        &nbsp;&nbsp;if terminal state: return score<br />
        &nbsp;&nbsp;if isMaximizing:<br />
        &nbsp;&nbsp;&nbsp;&nbsp;return max(minimax(child) for each move)<br />
        &nbsp;&nbsp;else:<br />
        &nbsp;&nbsp;&nbsp;&nbsp;return min(minimax(child) for each move)
      </p>
      <p>With perfect play on hard mode, the AI is <span className="text-primary">unbeatable</span>. The best you can achieve is a draw.</p>
    </Section>

    <Section title="WIN DETECTION">
      <p>After every move, the game checks all 8 possible winning lines (3 rows, 3 columns, 2 diagonals). If any line has three matching symbols, that player wins. The winning line is highlighted on the board.</p>
    </Section>

    <Section title="COMPLEXITY">
      <p><span className="text-accent">Game tree size:</span> 9! = 362,880 maximum nodes (before pruning). Minimax explores this exhaustively but since the tree is small, it runs instantly.</p>
      <p><span className="text-accent">Optimal play:</span> If both players play perfectly, the game always ends in a draw. Tic Tac Toe is a "solved game."</p>
    </Section>
  </div>
);

export default About;
