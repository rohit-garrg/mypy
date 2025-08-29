document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset-button');
    const cells = document.querySelectorAll('.cell');

    let currentPlayer = 'X';
    let gameActive = true;

    const handleCellClick = async (e) => {
        if (!gameActive) return;

        const cell = e.target;
        const row = cell.dataset.row;
        const col = cell.dataset.col;

        if (cell.textContent !== '') return;

        const response = await fetch('/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ row: parseInt(row), col: parseInt(col) }),
        });

        if (response.ok) {
            const data = await response.json();
            updateBoard(data.board);
            updateStatus(data);
        } else {
            console.error('Invalid move');
        }
    };

    const resetGame = async () => {
        const response = await fetch('/reset', {
            method: 'POST',
        });

        if (response.ok) {
            const data = await response.json();
            updateBoard(data.board);
            status.textContent = `Player ${data.currentPlayer}'s turn`;
            gameActive = true;
        }
    };

    const updateBoard = (boardState) => {
        cells.forEach(cell => {
            const row = cell.dataset.row;
            const col = cell.dataset.col;
            cell.textContent = boardState[row][col];
        });
    };

    const updateStatus = (data) => {
        if (data.winner) {
            status.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
        } else if (data.draw) {
            status.textContent = 'It\'s a draw!';
            gameActive = false;
        } else {
            currentPlayer = data.currentPlayer;
            status.textContent = `Player ${currentPlayer}'s turn`;
        }
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
});
