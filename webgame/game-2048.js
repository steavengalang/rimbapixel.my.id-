class Game2048 {
    constructor() {
        this.board = [];
        this.score = 0;
        this.bestScore = localStorage.getItem('2048BestScore') || 0;
        this.size = 4;
        this.gameBoard = document.getElementById('gameBoard');
        this.hasWon = false;
        
        this.init();
    }

    init() {
        document.getElementById('bestScore').textContent = this.bestScore;
        this.createBoard();
        this.createTiles();
        this.addEventListeners();
        this.newGame();
    }

    createBoard() {
        this.gameBoard.innerHTML = '';
        
        // Hitung jarak ubin berdasarkan ukuran layar
        const boardWidth = this.gameBoard.offsetWidth;
        const tileSize = Math.floor((boardWidth - 50) / 4);
        const spacing = Math.floor((boardWidth - (tileSize * 4)) / 5);
        
        // Buat ubin kosong
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = document.createElement('div');
                tile.className = 'tile tile-empty';
                tile.style.left = `${col * (tileSize + spacing) + spacing}px`;
                tile.style.top = `${row * (tileSize + spacing) + spacing}px`;
                tile.style.width = `${tileSize}px`;
                tile.style.height = `${tileSize}px`;
                this.gameBoard.appendChild(tile);
            }
        }
    }

    createTiles() {
        // Inisialisasi array papan
        this.board = [];
        for (let row = 0; row < this.size; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.size; col++) {
                this.board[row][col] = 0;
            }
        }
    }

    addEventListeners() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    this.move('up');
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    this.move('down');
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.move('left');
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.move('right');
                    break;
            }
        });

        // Tambahkan event listener untuk tombol
        document.getElementById('newGame').addEventListener('click', () => {
            this.newGame();
        });

        // Tombol suara
        let soundEnabled = true;
        document.getElementById('soundToggle').addEventListener('click', function() {
            soundEnabled = !soundEnabled;
            this.textContent = soundEnabled ? '🔊 Sound' : '🔇 Sound';
        });
    }

    newGame() {
        this.score = 0;
        this.hasWon = false;
        this.createTiles();
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
        document.getElementById('gameOver').style.display = 'none';
    }

    addRandomTile() {
        const emptyCells = [];
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] === 0) {
                    emptyCells.push({row, col});
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
        let moved = false;
        const previousBoard = this.board.map(row => [...row]);

        switch(direction) {
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
        }

        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            
            if (this.checkWin() && !this.hasWon) {
                this.hasWon = true;
                this.showGameOver(true);
            } else if (this.checkGameOver()) {
                this.showGameOver(false);
            }
        }
    }

    moveLeft() {
        let moved = false;
        
        for (let row = 0; row < this.size; row++) {
            const originalRow = [...this.board[row]];
            const newRow = this.processRow(this.board[row]);
            this.board[row] = newRow;
            
            if (!this.arraysEqual(originalRow, newRow)) {
                moved = true;
            }
        }
        
        return moved;
    }

    moveRight() {
        let moved = false;
        
        for (let row = 0; row < this.size; row++) {
            const originalRow = [...this.board[row]];
            const reversed = this.board[row].slice().reverse();
            const processed = this.processRow(reversed);
            this.board[row] = processed.reverse();
            
            if (!this.arraysEqual(originalRow, this.board[row])) {
                moved = true;
            }
        }
        
        return moved;
    }

    moveUp() {
        let moved = false;
        
        for (let col = 0; col < this.size; col++) {
            const column = [];
            for (let row = 0; row < this.size; row++) {
                column.push(this.board[row][col]);
            }
            
            const originalColumn = [...column];
            const processedColumn = this.processRow(column);
            
            for (let row = 0; row < this.size; row++) {
                this.board[row][col] = processedColumn[row];
            }
            
            if (!this.arraysEqual(originalColumn, processedColumn)) {
                moved = true;
            }
        }
        
        return moved;
    }

    moveDown() {
        let moved = false;
        
        for (let col = 0; col < this.size; col++) {
            const column = [];
            for (let row = 0; row < this.size; row++) {
                column.push(this.board[row][col]);
            }
            
            const originalColumn = [...column];
            const reversed = column.slice().reverse();
            const processed = this.processRow(reversed);
            const processedColumn = processed.reverse();
            
            for (let row = 0; row < this.size; row++) {
                this.board[row][col] = processedColumn[row];
            }
            
            if (!this.arraysEqual(originalColumn, processedColumn)) {
                moved = true;
            }
        }
        
        return moved;
    }

    processRow(row) {
        // Remove zeros
        const filtered = row.filter(val => val !== 0);
        
        // Merge adjacent equal values
        const merged = [];
        let i = 0;
        while (i < filtered.length) {
            if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
                merged.push(filtered[i] * 2);
                this.score += filtered[i] * 2;
                i += 2;
            } else {
                merged.push(filtered[i]);
                i++;
            }
        }
        
        // Pad with zeros
        while (merged.length < this.size) {
            merged.push(0);
        }
        
        return merged;
    }

    arraysEqual(a, b) {
        return a.length === b.length && a.every((val, i) => val === b[i]);
    }

    updateDisplay() {
        // Update score
        document.getElementById('score').textContent = this.score;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('2048BestScore', this.bestScore);
            document.getElementById('bestScore').textContent = this.bestScore;
        }

        // Clear existing number tiles
        const existingTiles = this.gameBoard.querySelectorAll('.tile:not(.tile-empty)');
        existingTiles.forEach(tile => tile.remove());

        // Add number tiles
        const boardWidth = this.gameBoard.offsetWidth;
        const tileSize = Math.floor((boardWidth - 50) / 4);
        const spacing = Math.floor((boardWidth - (tileSize * 4)) / 5);
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.board[row][col]}`;
                    tile.textContent = this.board[row][col];
                    tile.style.left = `${col * (tileSize + spacing) + spacing}px`;
                    tile.style.top = `${row * (tileSize + spacing) + spacing}px`;
                    tile.style.width = `${tileSize}px`;
                    tile.style.height = `${tileSize}px`;
                    
                    // Adjust font size based on tile size and number length
                    const fontSize = this.board[row][col] >= 1000 ? 
                        Math.max(12, tileSize * 0.25) : 
                        Math.max(14, tileSize * 0.35);
                    tile.style.fontSize = `${fontSize}px`;
                    
                    this.gameBoard.appendChild(tile);
                }
            }
        }
    }

    checkWin() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    checkGameOver() {
        // Check for empty cells
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] === 0) {
                    return false;
                }
            }
        }

        // Check for possible merges
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const current = this.board[row][col];
                
                // Check right
                if (col < this.size - 1 && this.board[row][col + 1] === current) {
                    return false;
                }
                
                // Check down
                if (row < this.size - 1 && this.board[row + 1][col] === current) {
                    return false;
                }
            }
        }

        return true;
    }

    showGameOver(won) {
        const gameOverElement = document.getElementById('gameOver');
        const titleElement = document.getElementById('gameOverTitle');
        const messageElement = document.getElementById('gameOverMessage');
        
        if (won) {
            titleElement.textContent = 'You Win!';
            titleElement.className = 'win';
            messageElement.innerHTML = 'Congratulations! You reached 2048!<br>Your Score: ' + this.score;
        } else {
            titleElement.textContent = 'Game Over!';
            titleElement.className = 'lose';
            messageElement.innerHTML = 'No more moves available!<br>Your Score: ' + this.score;
        }
        
        gameOverElement.style.display = 'flex';
    }
}

// Initialize game
let game;

function newGame() {
    game = new Game2048();
}

// Start the game when page loads
window.addEventListener('load', () => {
    newGame();
}); 