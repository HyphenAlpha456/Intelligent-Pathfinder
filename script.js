// script.js
const rows = 20, cols = 20;
let mode = 'none'; // default mode is none now
let grid = [], start = null, end = null, currentPos = null;
let priority = 'fast';
let animationRunning = false;

const gridContainer = document.getElementById('grid');
gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

function setMode(m) { mode = m; }
function setPriority(p) {
  priority = p;
  reroute();
}

function createGrid() {
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.onclick = handleCellClick;
      grid[r][c] = { row: r, col: c, cost: 1, isObstacle: false, el: cell };
      gridContainer.appendChild(cell);
      updateCellCostDisplay(cell, 1);
    }
  }
}

function handleCellClick(e) {
  if (mode === 'none') {
    alert("Please select a mode (Start, End, Obstacle, or Cost) before clicking the grid.");
    return;
  }

  const r = +e.target.dataset.row;
  const c = +e.target.dataset.col;
  const cell = grid[r][c];

  if (mode === 'start') {
    if (start) start.el.classList.remove('start');
    start = cell;
    currentPos = [r, c];
    cell.el.classList.add('start');
  } else if (mode === 'end') {
    if (end) end.el.classList.remove('end');
    end = cell;
    cell.el.classList.add('end');
  } else if (mode === 'obstacle') {
    cell.isObstacle = !cell.isObstacle;
    cell.el.classList.toggle('obstacle');
    updateCellCostDisplay(cell.el, cell.cost);
    reroute();
  } else if (mode === 'cost') {
    const newCost = prompt("Enter new cost for this cell (1-9):", cell.cost);
    if (newCost !== null) {
      const costVal = Math.max(1, Math.min(9, parseInt(newCost)));
      cell.cost = costVal;
      updateCellCostDisplay(cell.el, costVal);
    }
  }
}

function updateCellCostDisplay(cellEl, cost) {
  if (!cellEl.classList.contains('start') && !cellEl.classList.contains('end') && !cellEl.classList.contains('obstacle')) {
    cellEl.textContent = cost;
    cellEl.style.fontSize = '0.75rem';
    cellEl.style.color = '#333';
    cellEl.style.textAlign = 'center';
    cellEl.style.lineHeight = '100%';
  } else {
    cellEl.textContent = '';
  }
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function animatePath() {
  animationRunning = true;
  while (animationRunning) {
    const path = aStar(currentPos, [end.row, end.col]);
    if (!path) {
      alert("No path found");
      return;
    }
    for (let i = 1; i < path.length; i++) {
      const [r, c] = path[i];
      if (grid[r][c].isObstacle || priorityChanged) break;

      const [curR, curC] = currentPos;
      grid[curR][curC].el.classList.remove('agent');
      currentPos = [r, c];
      grid[r][c].el.classList.add('agent');

      if (r === end.row && c === end.col) {
        animationRunning = false;
        break;
      }

      await sleep(150);

      if (grid[r][c].isObstacle || priorityChanged) break;
    }
    priorityChanged = false;
  }
}

function reroute() {
  if (!animationRunning) return;
  priorityChanged = true;
}

let priorityChanged = false;

function findPath() {
  if (!start || !end) return alert("Set both start and end points.");
  if (animationRunning) return;
  animatePath();
}

class MinHeap {
  constructor() { this.heap = []; }
  push(item, priority) {
    this.heap.push({ item, priority });
    this.bubbleUp();
  }
  pop() {
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown();
    }
    return min.item;
  }
  bubbleUp() {
    let i = this.heap.length - 1;
    while (i > 0) {
      const parentIdx = Math.floor((i - 1) / 2);
      if (this.heap[i].priority >= this.heap[parentIdx].priority) break;
      [this.heap[i], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[i]];
      i = parentIdx;
    }
  }
  sinkDown() {
    let i = 0;
    const length = this.heap.length;
    while (true) {
      const left = 2 * i + 1, right = 2 * i + 2;
      let smallest = i;
      if (left < length && this.heap[left].priority < this.heap[smallest].priority) smallest = left;
      if (right < length && this.heap[right].priority < this.heap[smallest].priority) smallest = right;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
  isEmpty() { return this.heap.length === 0; }
}

function aStar(startCoord, endCoord) {
  const [sr, sc] = startCoord;
  const [er, ec] = endCoord;
  const key = (r, c) => `${r},${c}`;

  const openHeap = new MinHeap();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  const startKey = key(sr, sc);
  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(sr, sc, er, ec));
  openHeap.push(startKey, fScore.get(startKey));

  const directions = [
    [1, 0], [0, 1], [-1, 0], [0, -1],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
  ];

  while (!openHeap.isEmpty()) {
    const currentKey = openHeap.pop();
    const [r, c] = currentKey.split(',').map(Number);

    if (r === er && c === ec) return reconstructPathFromMap(cameFrom, currentKey);

    for (const [dr, dc] of directions) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const neighbor = grid[nr][nc];
      if (neighbor.isObstacle) continue;

      const neighborKey = key(nr, nc);
      const diagonal = Math.abs(dr) + Math.abs(dc) === 2;
      const moveCost = diagonal ? Math.SQRT2 : 1;
      const tentativeG = (gScore.get(currentKey) ?? Infinity) + moveCost * (priority === 'cheap' ? neighbor.cost : 1);

      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeG);
        const f = tentativeG + heuristic(nr, nc, er, ec);
        fScore.set(neighborKey, f);
        openHeap.push(neighborKey, f);
      }
    }
  }

  return null;
}

function reconstructPathFromMap(cameFrom, currentKey) {
  const path = [];
  while (cameFrom.has(currentKey)) {
    const [r, c] = currentKey.split(',').map(Number);
    path.unshift([r, c]);
    currentKey = cameFrom.get(currentKey);
  }
  const [sr, sc] = currentKey.split(',').map(Number);
  path.unshift([sr, sc]);
  return path;
}

function heuristic(r1, c1, r2, c2) {
  return Math.hypot(r1 - r2, c1 - c2);
}

createGrid();


