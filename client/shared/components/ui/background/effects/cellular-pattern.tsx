import React from 'react';

interface CellularPatternProps {
  density: number;
  evolutionSpeed: number;
  complexity: number;
  mousePosition: { x: number; y: number };
  isMouseMoving: boolean;
  baseColor: string;
  activeColor: string;
  viewportDimensions: { width: number; height: number };
}

export const CellularPattern: React.FC<CellularPatternProps> = ({
  density = 12,
  evolutionSpeed = 1,
  complexity = 3,
  mousePosition,
  isMouseMoving,
  baseColor = '#334155',
  activeColor = '#64748B',
  viewportDimensions,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [cells, setCells] = React.useState<Cell[][]>([]);
  const [generation, setGeneration] = React.useState(0);
  const evolutionIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Cell definition
  interface Cell {
    x: number;
    y: number;
    alive: boolean;
    nextState: boolean;
    influence: number;
  }

  // Initialize or reset the cell grid
  const initializeCells = React.useCallback(() => {
    if (viewportDimensions.width === 0 || viewportDimensions.height === 0) return;

    const cellWidth = Math.ceil(viewportDimensions.width / density);
    const cellHeight = Math.ceil(viewportDimensions.height / density);

    const cols = Math.ceil(viewportDimensions.width / cellWidth);
    const rows = Math.ceil(viewportDimensions.height / cellHeight);

    // Create the initial cell grid with random alive states
    const initialCells: Cell[][] = [];

    for (let y = 0; y < rows; y++) {
      initialCells[y] = [];
      for (let x = 0; x < cols; x++) {
        // Higher complexity = more initial living cells
        const aliveChance = 0.1 + complexity * 0.05;
        initialCells[y][x] = {
          x: x * cellWidth,
          y: y * cellHeight,
          alive: Math.random() < aliveChance,
          nextState: false,
          influence: 0,
        };
      }
    }

    setCells(initialCells);
    setGeneration(0);
  }, [viewportDimensions, density, complexity]);

  // Initialize cells on first render and when viewport changes
  React.useEffect(() => {
    initializeCells();
  }, [initializeCells]);

  // Calculate next generation based on Conway's Game of Life rules with influence from mouse movement
  const calculateNextGeneration = React.useCallback(() => {
    if (cells.length === 0) return;

    const rows = cells.length;
    const cols = cells[0].length;

    const nextCells = cells.map((row) => row.map((cell) => ({ ...cell })));

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Count alive neighbors (standard Game of Life rules)
        let aliveNeighbors = 0;

        // Check all 8 neighbors
        for (let ny = -1; ny <= 1; ny++) {
          for (let nx = -1; nx <= 1; nx++) {
            if (nx === 0 && ny === 0) continue; // Skip self

            const neighborY = (y + ny + rows) % rows; // Wrap around edges
            const neighborX = (x + nx + cols) % cols;

            if (cells[neighborY][neighborX].alive) {
              aliveNeighbors++;
            }
          }
        }

        // Apply Game of Life rules
        // 1. Any live cell with fewer than two live neighbors dies (underpopulation)
        // 2. Any live cell with two or three live neighbors lives on (survival)
        // 3. Any live cell with more than three live neighbors dies (overpopulation)
        // 4. Any dead cell with exactly three live neighbors becomes alive (reproduction)

        // Modified rules with influence factor
        if (cells[y][x].alive) {
          nextCells[y][x].nextState = aliveNeighbors === 2 || aliveNeighbors === 3;
        } else {
          // Add randomness based on complexity
          const randomBirth = Math.random() < 0.001 * complexity;
          nextCells[y][x].nextState = aliveNeighbors === 3 || randomBirth;
        }

        // Apply mouse influence if mouse is moving
        if (isMouseMoving) {
          const cellCenterX = cells[y][x].x + viewportDimensions.width / density / 2;
          const cellCenterY = cells[y][x].y + viewportDimensions.height / density / 2;

          const distanceToMouse = Math.sqrt(
            (cellCenterX - mousePosition.x) ** 2 + (cellCenterY - mousePosition.y) ** 2,
          );

          // Mouse influence decreases with distance
          const influence = Math.max(0, 1 - distanceToMouse / 200);

          if (influence > 0.5) {
            nextCells[y][x].nextState = true; // Make cells near mouse alive
            nextCells[y][x].influence = influence;
          }
        } else {
          // Decay influence over time
          nextCells[y][x].influence = Math.max(0, cells[y][x].influence - 0.05);
        }
      }
    }

    // Apply the calculated next states
    setCells(
      nextCells.map((row) =>
        row.map((cell) => ({
          ...cell,
          alive: cell.nextState,
        })),
      ),
    );

    setGeneration((prev) => prev + 1);
  }, [cells, mousePosition, isMouseMoving, density, viewportDimensions, complexity]);

  // Handle evolution timing
  React.useEffect(() => {
    // Clear previous interval if any
    if (evolutionIntervalRef.current) {
      clearInterval(evolutionIntervalRef.current);
    }

    // Set evolution interval based on speed
    const intervalTime = 1000 / evolutionSpeed;
    evolutionIntervalRef.current = setInterval(() => {
      calculateNextGeneration();
    }, intervalTime);

    return () => {
      if (evolutionIntervalRef.current) {
        clearInterval(evolutionIntervalRef.current);
      }
    };
  }, [calculateNextGeneration, evolutionSpeed]);

  // Draw the cells on canvas
  React.useEffect(() => {
    if (!canvasRef.current || cells.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = viewportDimensions.width;
    canvas.height = viewportDimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellWidth = canvas.width / density;
    const cellHeight = canvas.height / density;

    // Draw cells
    for (const row of cells) {
      for (const cell of row) {
        if (cell.alive) {
          // Calculate color based on base color, active color, and influence
          const color = cell.influence > 0 ? activeColor : baseColor;
          const alpha = 0.2 + cell.influence * 0.6;

          ctx.fillStyle = color;
          ctx.globalAlpha = alpha;

          // Draw rounded cell
          ctx.beginPath();
          const radius = cellWidth * 0.3 * (1 + cell.influence * 0.3);
          ctx.arc(cell.x + cellWidth / 2, cell.y + cellHeight / 2, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Reset alpha
    ctx.globalAlpha = 1;
  }, [cells, viewportDimensions, density, baseColor, activeColor]);

  // Reset the pattern periodically or when it gets "stuck" in a stable state
  React.useEffect(() => {
    const resetTimeout = setTimeout(() => {
      // Reset if too many generations have passed or all cells are dead/stable
      if (generation > 300) {
        initializeCells();
      }
    }, 60000); // Reset after 1 minute if needed

    return () => clearTimeout(resetTimeout);
  }, [generation, initializeCells]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
};
