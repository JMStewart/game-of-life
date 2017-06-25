import style from './style.css';
import Board from './board.js';

const unitSize = 10;
const rows = 60;
const columns = 80;
const WHITE = '#FFF';
const BLACK = '#000';

let interval;

const gameBoard = document.getElementById('gameBoard');
gameBoard.width = columns*unitSize+1;
gameBoard.height = rows*unitSize+1;
const ctx = gameBoard.getContext('2d');
// ctx.translate(0.5, 0.5);


let board = initBoard(rows, columns);
setupListener(gameBoard);
setupButtons();
drawGame(board);


function initBoard(rows, columns) {
  const newBoard = new Board(rows, columns);
  return newBoard;
}

function drawGrid() {
  ctx.strokeStyle = BLACK;
  for (let r=0; r<=rows; r++) {
    ctx.moveTo(0, r*unitSize);
    ctx.lineTo(columns*unitSize, r*unitSize);
  }
  for (let c=0; c<=columns; c++) {
    ctx.moveTo(c*unitSize, 0);
    ctx.lineTo(c*unitSize, rows*unitSize);
  }
  ctx.stroke();
}

function drawRect([y, x]) {
  ctx.fillStyle = BLACK;
  ctx.fillRect(x*unitSize, y*unitSize, unitSize, unitSize);
}

function drawGame(board) {
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, columns*unitSize, rows*unitSize);
  // drawGrid();
  const activeCells = board.getActiveCells()
  activeCells.map(drawRect);
  if (activeCells.length === 0) {
    pauseSimulation();
  }
}

function setupListener(el) {
  let currentCell;
  let running = false;
  el.addEventListener('mousedown', (event) => {
    running = !!interval;
    if (running) {
      console.log('Drawing new cells');
      pauseSimulation();
    }
    currentCell = getCell(el, event);
    board.toggleCell(...currentCell);
    drawGame(board);
    if (board.getCell(...currentCell)) {
      el.addEventListener('mousemove', mouseActivate);
    } else {
      el.addEventListener('mousemove', mouseDeactivate);
    }
  });
  el.addEventListener('mouseup', removeListeners);
  el.addEventListener('mouseout', removeListeners);

  function removeListeners() {
    if (running) {
      runSimulation();
    }
    el.removeEventListener('mousemove', mouseActivate);
    el.removeEventListener('mousemove', mouseDeactivate);
  }

  function mouseActivate(event) {
    const cell = getCell(el, event);
    if (cell[0] !== currentCell[0] || cell[1] !== currentCell[1]) {
      currentCell = cell;
      board.activateCell(...cell);
      drawGame(board);
    }
  }

  function mouseDeactivate(event) {
    const cell = getCell(el, event);
    if (cell[0] !== currentCell[0] || cell[1] !== currentCell[1]) {
      currentCell = cell;
      board.deactivateCell(...cell);
      drawGame(board);
    }
  }
}


function getCell(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  return [Math.floor(y/unitSize), Math.floor(x/unitSize)];
}

function toggleSimulation() {
  if (interval) {
    pauseSimulation();
  } else {
    runSimulation();
  }
}

function runSimulation() {
  function animate() {
    console.timeEnd('Frame');
    console.time('Frame');
    if (interval) {
      interval = requestAnimationFrame(animate);
    }
    board.tick();
    drawGame(board);
  }
  interval = requestAnimationFrame(animate);
  document.getElementById('play').innerHTML = 'Pause';
}

function pauseSimulation() {
  document.getElementById('play').innerHTML = 'Play';
  cancelAnimationFrame(interval);
  interval = null;
}

function clearBoard() {
  board.clear();
  drawGame(board);
}

function randomizeBoard() {
  board.randomize();
  drawGame(board);
}

function setupButtons() {
  document.getElementById('play').addEventListener('click', toggleSimulation);
  document.getElementById('clear').addEventListener('click', clearBoard);
  document.getElementById('randomize').addEventListener('click', randomizeBoard);
}