import { range } from 'utils/array';

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  hash() {
    return `${this.x}:${this.y}`;
  }

  add(move: Move) {
    const { x: dx, y: dy } =
      move === 'wait' ? new Point(0, 0) : dirToPoint[move];
    return new Point(this.x + dx, this.y + dy);
  }

  directions(other: Point, prio: Axis = 'horizontal') {
    const prios: Record<Direction, number> =
      prio === 'horizontal'
        ? {
            left: 1,
            right: 1,
            up: 2,
            down: 2,
          }
        : {
            up: 1,
            down: 1,
            left: 2,
            right: 2,
          };
    const [dx, dy] = [other.x - this.x, other.y - this.y];
    const out: Direction[] = [];
    if (dy != 0) {
      out.push(dy > 0 ? 'down' : 'up');
    }

    if (dx != 0) {
      out.push(dx > 0 ? 'right' : 'left');
    }
    return out.sort((a, b) => prios[a] - prios[b]);
  }

  clone() {
    return new Point(this.x, this.y);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

export const ALL_DIRECTIONS = ['up', 'down', 'left', 'right'] as const;
export type Direction = (typeof ALL_DIRECTIONS)[number];
const ALL_MOVES = ['up', 'down', 'left', 'right', 'wait'] as const;
export type Move = (typeof ALL_MOVES)[number];

type Axis = 'horizontal' | 'vertical';
type EnemyType = 'mummy' | 'scorpion';

export interface Enemy {
  kind: EnemyType;
  pos: Point;
  priority: Axis;
}

export class Maze {
  walls: Map<string, Set<'up' | 'left'>>;
  size: Point;

  constructor({
    walls,
    size,
  }: {
    walls: Map<string, Set<'up' | 'left'>>;
    size: Point;
  }) {
    this.walls = walls;
    this.size = size;
  }

  wallsAt({ x, y }: Point) {
    // Copy set, otherwise we could accidentally modify the wall set
    const out: Set<Direction> = new Set(
      this.walls.get(new Point(x, y).hash()) ?? new Set(),
    );
    if (x < 0 || x >= this.size.x || y < 0 || y >= this.size.y) {
      return new Set(ALL_DIRECTIONS);
    }
    if (y <= 0) {
      out.add('up');
    }
    if (x <= 0) {
      out.add('left');
    }
    if (
      y + 1 >= this.size.y ||
      (this.walls.get(new Point(x, y + 1).hash()) ?? new Set()).has('up')
    ) {
      out.add('down');
    }
    if (
      x + 1 >= this.size.x ||
      (this.walls.get(new Point(x + 1, y).hash()) ?? new Set()).has('left')
    ) {
      out.add('right');
    }
    return out;
  }

  canMove(from: Point, move: Move) {
    return move === 'wait' || !this.wallsAt(from).has(move);
  }

  findUnreachable() {
    const { x: width, y: height } = this.size;
    const visited = new Set();
    const queue: Point[] = [new Point(0, 0)];
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) {
        break;
      }

      const hash = current.hash();
      if (visited.has(hash)) {
        continue;
      }

      visited.add(hash);

      for (const direction of ALL_DIRECTIONS) {
        if (!this.canMove(current, direction)) {
          continue;
        }
        const next = current.add(direction);
        if (visited.has(next.hash())) {
          continue;
        }
        queue.push(next);
      }
    }
    return range(height)
      .flatMap((y) => range(width).map((x) => new Point(x, y)))
      .filter((p) => !visited.has(p.hash()));
  }

  toggleWall(point: Point, dir: Direction) {
    const wallPoint = ['up', 'left'].includes(dir) ? point : point.add(dir);
    const actualDir = dir === 'right' ? 'left' : dir === 'down' ? 'up' : dir;
    if (this.wallsAt(wallPoint).has(actualDir)) {
      this.walls.set(
        wallPoint.hash(),
        (this.walls.get(wallPoint.hash()) ?? new Set()).difference(
          new Set([actualDir]),
        ),
      );
    } else {
      this.walls.set(
        wallPoint.hash(),
        (this.walls.get(wallPoint.hash()) ?? new Set()).union(
          new Set([actualDir]),
        ),
      );
    }
  }

  fix() {
    for (;;) {
      const unreachables = this.findUnreachable();

      if (unreachables.length === 0) {
        return true;
      }

      let foundImprovement = false;

      for (const tile of unreachables.sort((a, b) =>
        a.x !== b.x ? a.x - b.x : a.y - b.y,
      )) {
        for (const dir of ALL_DIRECTIONS) {
          this.toggleWall(tile, dir);
          const newUnreachables = this.findUnreachable().length;
          if (newUnreachables < unreachables.length) {
            foundImprovement = true;
            break;
          }
          this.toggleWall(tile, dir);
        }
        if (foundImprovement) {
          break;
        }
      }

      if (!foundImprovement) {
        // No improvement could be found
        return false;
      }
    }
  }
}

const dirToPoint: Record<Direction, Point> = {
  up: new Point(0, -1),
  down: new Point(0, 1),
  left: new Point(-1, 0),
  right: new Point(1, 0),
};

interface MummyMazeInput {
  enemies: Enemy[];
  gate?: [Point, 'up' | 'left'];
  startPos: Point;
  goal: Point;
  maze: Maze;
  history?: Move[];
  playerPos?: Point;
}

export class MummyMaze {
  enemies: Enemy[];
  gate?: [Point, 'up' | 'left'];
  startPos: Point;
  goal: Point;
  maze: Maze;
  history: Move[];
  playerPos: Point;
  enemyStartingPos: Point[];

  constructor({
    enemies,
    goal,
    maze,
    startPos,
    gate,
    history = [],
    playerPos,
  }: MummyMazeInput) {
    this.enemies = enemies;
    this.goal = goal;
    this.startPos = startPos;
    this.gate = gate;
    this.maze = maze;
    this.history = history;
    this.playerPos = playerPos ?? startPos.clone();
    this.enemyStartingPos = enemies.map((e) => e.pos.clone());
  }

  reset() {
    this.history = [];
    this.enemies = this.enemies.map((enemy, i) => ({
      ...enemy,
      pos: this.enemyStartingPos[i]?.clone() as Point,
    }));
    this.playerPos = this.startPos.clone();
  }

  undo() {
    const history = this.history.slice(0, -1);
    this.reset();
    this.doMoves(history);
  }

  calcEnemyMove(enemy: Enemy) {
    return (
      enemy.pos
        .directions(this.playerPos, enemy.priority)
        .find((dir) => this.maze.canMove(enemy.pos, dir)) ?? 'wait'
    );
  }

  doMoves(moves: Move[]) {
    for (const move of moves) {
      this.playerPos = this.playerPos.add(move);
      // Move all enemies
      this.enemies = this.enemies.map((enemy) => ({
        ...enemy,
        pos: enemy.pos.add(this.calcEnemyMove(enemy)),
      }));
      // Kill scorpions overlapping with other enemies
      this.enemies.forEach((enemy, i, enemies) => {
        if (enemy.kind !== 'scorpion') {
          return;
        }
        const hash = enemy.pos.hash();
        if (enemies.some((other, j) => i !== j && hash === other.pos.hash())) {
          enemy.pos = new Point(-1, -1);
        }
      });
      // Kill mummies overlapping with other mummies
      this.enemies.forEach((enemy, i, enemies) => {
        const hash = enemy.pos.hash();
        if (enemies.some((other, j) => i !== j && hash === other.pos.hash())) {
          enemy.pos = new Point(-1, -1);
        }
      });

      // Do above again but only move mummies
      this.enemies = this.enemies.map((enemy) => ({
        ...enemy,
        pos:
          enemy.kind === 'mummy'
            ? enemy.pos.add(this.calcEnemyMove(enemy))
            : enemy.pos,
      }));
      this.enemies.forEach((enemy, i, enemies) => {
        if (enemy.kind !== 'scorpion') {
          return;
        }
        const hash = enemy.pos.hash();
        if (enemies.some((other, j) => i !== j && hash === other.pos.hash())) {
          enemy.pos = new Point(-1, -1);
        }
      });
      this.enemies.forEach((enemy, i, enemies) => {
        const hash = enemy.pos.hash();
        if (enemies.some((other, j) => i !== j && hash === other.pos.hash())) {
          enemy.pos = new Point(-1, -1);
        }
      });
      this.history.push(move);
    }
  }

  doMove(move: Move) {
    this.doMoves([move]);
  }

  isLost() {
    return this.enemies.some(
      (enemy) => enemy.pos.hash() === this.playerPos.hash(),
    );
  }

  isWon() {
    return !this.isLost() && this.playerPos.hash() === this.goal.hash();
  }

  hash() {
    return `${this.playerPos.hash()}/${this.enemies
      .map((e) => e.pos.hash())
      .join(',')}`;
  }

  clone() {
    const clone = new MummyMaze({
      goal: this.goal,
      startPos: this.startPos,
      gate: this.gate,
      maze: this.maze,
      enemies: this.enemies.slice(),
      history: this.history.slice(),
      playerPos: this.playerPos.clone(),
    });
    clone.enemyStartingPos = this.enemyStartingPos.map((p) => p.clone());
    return clone;
  }

  solve() {
    const seenStates = new Set();
    const queue: Move[][] = [[]];

    while (queue.length > 0) {
      // Make copy of initial game state
      const game = this.clone();
      const moves = queue.shift();
      if (!moves) {
        return;
      }
      game.doMoves(moves);
      const hash = game.hash();
      if (seenStates.has(hash) || game.isLost()) {
        continue;
      } else if (game.isWon()) {
        return moves;
      }

      seenStates.add(hash);

      for (const move of ALL_MOVES.filter((m) =>
        game.maze.canMove(game.playerPos, m),
      )) {
        moves.push(move);
        queue.push(moves.slice());
        moves.pop();
      }
    }
  }
}
