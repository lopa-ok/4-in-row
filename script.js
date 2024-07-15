const ROWS = 6;
const COLS = 7;
let currentPlayer = 1;
let board = [];
const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restart');

function createBoard() {
    boardElement.innerHTML = '';
    board = [];
    for (let row = 0; row < ROWS; row++) {
        const rowArray = [];
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
            rowArray.push(0);
        }
        board.push(rowArray);
    }
}

function handleCellClick(event) {
    const col = parseInt(event.target.dataset.col);
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            board[row][col] = currentPlayer;
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            cell.classList.add(`player${currentPlayer}`);
            currentPlayer = 3 - currentPlayer; // switch player
            messageElement.textContent = `Player ${currentPlayer}'s turn`;
            break;
        }
    }
}

restartButton.addEventListener('click', () => {
    createBoard();
    currentPlayer = 1;
    messageElement.textContent = `Player ${currentPlayer}'s turn`;
});

createBoard();
messageElement.textContent = `Player ${currentPlayer}'s turn`;
