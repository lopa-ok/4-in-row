const ROWS = 6;
const COLS = 7;
let currentPlayer = 1;
let board = [];
let isSinglePlayer = false;
let difficulty = 'easy';
const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restart');
const singlePlayerButton = document.getElementById('singlePlayer');
const multiPlayerButton = document.getElementById('multiPlayer');
const difficultyButtons = document.getElementById('difficulty');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const menu = document.getElementById('menu');

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
    if (messageElement.textContent !== `Player ${currentPlayer}'s turn`) return;

    const col = parseInt(event.target.dataset.col);
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            board[row][col] = currentPlayer;
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            cell.classList.add(`player${currentPlayer}`);
            if (checkWin(row, col)) {
                messageElement.textContent = `Player ${currentPlayer} wins!`;
                removeClickEvents();
            } else if (board.flat().every(cell => cell !== 0)) {
                messageElement.textContent = 'It\'s a draw!';
            } else {
                currentPlayer = 3 - currentPlayer; // switch player
                messageElement.textContent = `Player ${currentPlayer}'s turn`;

                if (isSinglePlayer && currentPlayer === 2) {
                    setTimeout(makeAIMove, 500); // AI makes a move after a short delay
                }
            }
            break;
        }
    }
}

function makeAIMove() {
    let col;
    if (difficulty === 'easy') {
        col = randomMove();
    } else if (difficulty === 'medium') {
        col = mediumAIMove();
    } else {
        col = hardAIMove();
    }

    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            board[row][col] = 2;
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            cell.classList.add('player2');
            if (checkWin(row, col)) {
                messageElement.textContent = 'Player 2 wins!';
                removeClickEvents();
            } else if (board.flat().every(cell => cell !== 0)) {
                messageElement.textContent = 'It\'s a draw!';
            } else {
                currentPlayer = 1;
                messageElement.textContent = `Player ${currentPlayer}'s turn`;
            }
            break;
        }
    }
}

function randomMove() {
    let col;
    do {
        col = Math.floor(Math.random() * COLS);
    } while (board[0][col] !== 0);
    return col;
}

function mediumAIMove() {
    for (let col = 0; col < COLS; col++) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] === 0) {
                board[row][col] = 2;
                if (checkWin(row, col)) {
                    board[row][col] = 0;
                    return col;
                }
                board[row][col] = 0;
                break;
            }
        }
    }
    for (let col = 0; col < COLS; col++) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] === 0) {
                board[row][col] = 1;
                if (checkWin(row, col)) {
                    board[row][col] = 0;
                    return col;
                }
                board[row][col] = 0;
                break;
            }
        }
    }
    return randomMove();
}

function hardAIMove() {
    let bestScore = -Infinity;
    let move;
    for (let col = 0; col < COLS; col++) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] === 0) {
                board[row][col] = 2;
                let score = minimax(board, 0, false);
                board[row][col] = 0;
                if (score > bestScore) {
                    bestScore = score;
                    move = col;
                }
                break;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinCondition(board, 2)) {
        return 10 - depth;
    }
    if (checkWinCondition(board, 1)) {
        return depth - 10;
    }
    if (board.flat().every(cell => cell !== 0)) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let col = 0; col < COLS; col++) {
            for (let row = ROWS - 1; row >= 0; row--) {
                if (board[row][col] === 0) {
                    board[row][col] = 2;
                    let score = minimax(board, depth + 1, false);
                    board[row][col] = 0;
                    bestScore = Math.max(score, bestScore);
                    break;
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let col = 0; col < COLS; col++) {
            for (let row = ROWS - 1; row >= 0; row--) {
                if (board[row][col] === 0) {
                    board[row][col] = 1;
                    let score = minimax(board, depth + 1, true);
                    board[row][col] = 0;
                    bestScore = Math.min(score, bestScore);
                    break;
                }
            }
        }
        return bestScore;
    }
}

function checkWin(row, col) {
    return (
        checkDirection(row, col, 1, 0) || // horizontal
        checkDirection(row, col, 0, 1) || // vertical
        checkDirection(row, col, 1, 1) || // diagonal down-right
        checkDirection(row, col, 1, -1)   // diagonal up-right
    );
}

function checkDirection(row, col, rowDir, colDir) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
        const newRow = row + i * rowDir;
        const newCol = col + i * colDir;
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }
    for (let i = 1; i < 4; i++) {
        const newRow = row - i * rowDir;
        const newCol = col - i * colDir;
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }
    return count >= 4;
}

function checkWinCondition(board, player) {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] === player) {
                if (
                    checkDirectionWin(board, row, col, 1, 0, player) || // horizontal
                    checkDirectionWin(board, row, col, 0, 1, player) || // vertical
                    checkDirectionWin(board, row, col, 1, 1, player) || // diagonal down-right
                    checkDirectionWin(board, row, col, 1, -1, player)   // diagonal up-right
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

function checkDirectionWin(board, row, col, rowDir, colDir, player) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
        const newRow = row + i * rowDir;
        const newCol = col + i * colDir;
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol] === player) {
            count++;
        } else {
            break;
        }
    }
    for (let i = 1; i < 4; i++) {
        const newRow = row - i * rowDir;
        const newCol = col - i * colDir;
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol] === player) {
            count++;
        } else {
            break;
        }
    }
    return count >= 4;
}

function removeClickEvents() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
}

function startGame(singlePlayer) {
    createBoard();
    currentPlayer = 1;
    isSinglePlayer = singlePlayer;
    messageElement.textContent = `Player ${currentPlayer}'s turn`;
    boardElement.style.display = 'grid';
    restartButton.style.display = 'block';
    menu.style.display = 'none';
    difficultyButtons.style.display = 'none';
}

function showDifficultyMenu() {
    menu.style.display = 'none';
    difficultyButtons.style.display = 'block';
}

singlePlayerButton.addEventListener('click', showDifficultyMenu);
multiPlayerButton.addEventListener('click', () => startGame(false));

easyButton.addEventListener('click', () => {
    difficulty = 'easy';
    startGame(true);
});
mediumButton.addEventListener('click', () => {
    difficulty = 'medium';
    startGame(true);
});
hardButton.addEventListener('click', () => {
    difficulty = 'hard';
    startGame(true);
});

restartButton.addEventListener('click', () => {
    startGame(isSinglePlayer);
});

createBoard();
messageElement.textContent = `Select game mode`;
