class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextPieceCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        this.holdCanvas = document.getElementById('holdPieceCanvas');
        this.holdCtx = this.holdCanvas.getContext('2d');
        
        // Atur ukuran kanvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Konstanta permainan
        this.BLOCK_SIZE = 30;
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.DROP_TIME = 1000;
        this.offsetX = 0;
        this.offsetY = 0;
        
        // Status permainan
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.holdPiece = null;
        this.canHold = true;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameStarted = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.lastTime = 0;
        this.dropCounter = 0;
        
        // Blok Tetris
        this.pieces = {
            'I': {
                shape: [
                    [1, 1, 1, 1]
                ],
                color: '#00ffff'
            },
            'O': {
                shape: [
                    [1, 1],
                    [1, 1]
                ],
                color: '#ffff00'
            },
            'T': {
                shape: [
                    [0, 1, 0],
                    [1, 1, 1]
                ],
                color: '#800080'
            },
            'S': {
                shape: [
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                color: '#00ff00'
            },
            'Z': {
                shape: [
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                color: '#ff0000'
            },
            'J': {
                shape: [
                    [1, 0, 0],
                    [1, 1, 1]
                ],
                color: '#0000ff'
            },
            'L': {
                shape: [
                    [0, 0, 1],
                    [1, 1, 1]
                ],
                color: '#ffa500'
            }
        };
        
        // Efek suara
        this.sounds = {
            line: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...'),
            tetris: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...'),
            move: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...'),
            rotate: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...'),
            gameOver: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUK...')
        };
        this.soundEnabled = true;
        
        this.init();
    }
    
    init() {
        this.setupControls();
        this.initBoard();
        this.updateUI();
        this.showStartScreen();
    }
    
    setupControls() {
        // Kontrol keyboard
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Kontrol sentuh
        document.getElementById('leftButton').addEventListener('click', () => this.movePiece(-1, 0));
        document.getElementById('rightButton').addEventListener('click', () => this.movePiece(1, 0));
        document.getElementById('rotateButton').addEventListener('click', () => this.rotatePiece());
        document.getElementById('softDropButton').addEventListener('click', () => this.movePiece(0, 1));
        document.getElementById('hardDropButton').addEventListener('click', () => this.hardDrop());
        document.getElementById('holdButton').addEventListener('click', () => this.holdCurrentPiece());
        
        // Kontrol permainan
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('pauseGame').addEventListener('click', () => this.togglePause());
        document.getElementById('soundToggle').addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            document.getElementById('soundToggle').textContent = 
                this.soundEnabled ? '🔊 Sound' : '🔇 Sound';
        });
    }
    
    handleKeyDown(e) {
        if (!this.gameStarted || this.gamePaused || this.gameOver) return;
        
        switch(e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.movePiece(0, 1);
                break;
            case 'ArrowUp':
            case 'KeyW':
                this.rotatePiece();
                break;
            case 'Space':
                e.preventDefault();
                this.hardDrop();
                break;
            case 'KeyC':
                this.holdCurrentPiece();
                break;
            case 'KeyP':
                this.togglePause();
                break;
        }
    }
    
    initBoard() {
        this.board = Array(this.BOARD_HEIGHT).fill(null).map(() => Array(this.BOARD_WIDTH).fill(0));
    }
    
    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.gameOver = false;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.canHold = true;
        this.holdPiece = null;
        
        this.initBoard();
        this.spawnPiece();
        this.spawnNextPiece();
        
        document.getElementById('startGame').style.display = 'none';
        this.updateUI();
        requestAnimationFrame((time) => this.update(time));
    }
    
    spawnPiece() {
        if (this.nextPiece) {
            this.currentPiece = this.nextPiece;
        } else {
            this.currentPiece = this.createPiece();
        }
        
        this.currentPiece.x = Math.floor(this.BOARD_WIDTH / 2) - Math.floor(this.currentPiece.shape[0].length / 2);
        this.currentPiece.y = 0;
        
        // Check game over
        if (this.checkCollision(0, 0)) {
            this.gameOver = true;
            this.showGameOver();
            return;
        }
        
        this.spawnNextPiece();
    }
    
    spawnNextPiece() {
        this.nextPiece = this.createPiece();
        this.drawNextPiece();
    }
    
    createPiece() {
        const pieceTypes = Object.keys(this.pieces);
        const type = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
        const template = this.pieces[type];
        
        return {
            type: type,
            shape: template.shape.map(row => [...row]),
            color: template.color,
            x: 0,
            y: 0
        };
    }
    
    holdCurrentPiece() {
        if (!this.canHold || !this.currentPiece) return;
        
        if (this.holdPiece) {
            // Swap current and hold pieces
            const temp = this.holdPiece;
            this.holdPiece = this.currentPiece;
            this.currentPiece = temp;
            
            this.currentPiece.x = Math.floor(this.BOARD_WIDTH / 2) - Math.floor(this.currentPiece.shape[0].length / 2);
            this.currentPiece.y = 0;
        } else {
            // Move current piece to hold
            this.holdPiece = this.currentPiece;
            this.spawnPiece();
        }
        
        this.canHold = false;
        this.drawHoldPiece();
    }
    
    checkCollision(offsetX = 0, offsetY = 0, piece = this.currentPiece) {
        if (!piece) return false;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const newX = piece.x + x + offsetX;
                    const newY = piece.y + y + offsetY;
                    
                    if (newX < 0 || newX >= this.BOARD_WIDTH || 
                        newY >= this.BOARD_HEIGHT || 
                        (newY >= 0 && this.board[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    movePiece(dx, dy) {
        if (!this.currentPiece) return;
        
        if (!this.checkCollision(dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            this.playSound('move');
            return true;
        }
        
        if (dy > 0) {
            this.mergePiece();
            return false;
        }
        
        return false;
    }
    
    rotatePiece() {
        if (!this.currentPiece) return;
        
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        const originalShape = this.currentPiece.shape;
        
        this.currentPiece.shape = rotated;
        
        // Wall kicks
        const kicks = [0, -1, 1, -2, 2];
        for (let kick of kicks) {
            if (!this.checkCollision(kick, 0)) {
                this.currentPiece.x += kick;
                this.playSound('rotate');
                return;
            }
        }
        
        // Restore original shape if rotation failed
        this.currentPiece.shape = originalShape;
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }
        
        return rotated;
    }
    
    hardDrop() {
        if (!this.currentPiece) return;
        
        let dropDistance = 0;
        while (!this.checkCollision(0, dropDistance + 1)) {
            dropDistance++;
        }
        
        this.currentPiece.y += dropDistance;
        this.mergePiece();
    }
    
    mergePiece() {
        if (!this.currentPiece) return;
        
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardX = this.currentPiece.x + x;
                    const boardY = this.currentPiece.y + y;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
        
        this.clearLines();
        this.spawnPiece();
        this.canHold = true;
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
                linesCleared++;
                y++; // Check the same line again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            
            // Scoring
            const linePoints = [0, 100, 300, 500, 800];
            this.score += linePoints[linesCleared] * this.level;
            
            // Level up every 10 lines
            this.level = Math.floor(this.lines / 10) + 1;
            
            this.updateUI();
            
            if (linesCleared === 4) {
                this.playSound('tetris');
            } else {
                this.playSound('line');
            }
        }
    }
    
    getGhostPiecePosition() {
        if (!this.currentPiece) return null;
        
        let ghostY = this.currentPiece.y;
        while (!this.checkCollision(0, ghostY - this.currentPiece.y + 1)) {
            ghostY++;
        }
        
        return { ...this.currentPiece, y: ghostY };
    }
    
    draw() {
        // Clear main canvas
        this.ctx.fillStyle = '#000033';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= this.BOARD_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + x * this.BLOCK_SIZE, this.offsetY);
            this.ctx.lineTo(this.offsetX + x * this.BLOCK_SIZE, this.offsetY + this.BOARD_HEIGHT * this.BLOCK_SIZE);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.BOARD_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX, this.offsetY + y * this.BLOCK_SIZE);
            this.ctx.lineTo(this.offsetX + this.BOARD_WIDTH * this.BLOCK_SIZE, this.offsetY + y * this.BLOCK_SIZE);
            this.ctx.stroke();
        }
        
        // Draw board
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x]) {
                    this.drawBlock(x, y, this.board[y][x]);
                }
            }
        }
        
        // Draw ghost piece
        const ghostPiece = this.getGhostPiecePosition();
        if (ghostPiece) {
            this.drawPiece(ghostPiece, true);
        }
        
        // Draw current piece
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece);
        }
    }
    
    drawBlock(x, y, color, isGhost = false) {
        const pixelX = (this.offsetX || 0) + x * this.BLOCK_SIZE;
        const pixelY = (this.offsetY || 0) + y * this.BLOCK_SIZE;
        
        this.ctx.fillStyle = isGhost ? 'rgba(255, 255, 255, 0.2)' : color;
        this.ctx.fillRect(pixelX, pixelY, this.BLOCK_SIZE, this.BLOCK_SIZE);
        
        if (!isGhost) {
            // Add border
            this.ctx.strokeStyle = this.adjustColor(color, -30);
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pixelX, pixelY, this.BLOCK_SIZE, this.BLOCK_SIZE);
            
            // Add highlight
            this.ctx.fillStyle = this.adjustColor(color, 30);
            this.ctx.fillRect(pixelX + 2, pixelY + 2, this.BLOCK_SIZE - 4, 4);
        }
    }
    
    drawPiece(piece, isGhost = false) {
        if (!piece) return;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    this.drawBlock(piece.x + x, piece.y + y, piece.color, isGhost);
                }
            }
        }
    }
    
    drawNextPiece() {
        if (!this.nextPiece) return;
        
        this.nextCtx.fillStyle = '#000033';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * 20) / 2;
        const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * 20) / 2;
        
        for (let y = 0; y < this.nextPiece.shape.length; y++) {
            for (let x = 0; x < this.nextPiece.shape[y].length; x++) {
                if (this.nextPiece.shape[y][x]) {
                    this.nextCtx.fillStyle = this.nextPiece.color;
                    this.nextCtx.fillRect(
                        offsetX + x * 20,
                        offsetY + y * 20,
                        20,
                        20
                    );
                    
                    this.nextCtx.strokeStyle = this.adjustColor(this.nextPiece.color, -30);
                    this.nextCtx.strokeRect(
                        offsetX + x * 20,
                        offsetY + y * 20,
                        20,
                        20
                    );
                }
            }
        }
    }
    
    drawHoldPiece() {
        this.holdCtx.fillStyle = '#000033';
        this.holdCtx.fillRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);
        
        if (!this.holdPiece) return;
        
        const offsetX = (this.holdCanvas.width - this.holdPiece.shape[0].length * 20) / 2;
        const offsetY = (this.holdCanvas.height - this.holdPiece.shape.length * 20) / 2;
        
        for (let y = 0; y < this.holdPiece.shape.length; y++) {
            for (let x = 0; x < this.holdPiece.shape[y].length; x++) {
                if (this.holdPiece.shape[y][x]) {
                    this.holdCtx.fillStyle = this.canHold ? this.holdPiece.color : 'rgba(128, 128, 128, 0.5)';
                    this.holdCtx.fillRect(
                        offsetX + x * 20,
                        offsetY + y * 20,
                        20,
                        20
                    );
                    
                    this.holdCtx.strokeStyle = this.adjustColor(this.holdPiece.color, -30);
                    this.holdCtx.strokeRect(
                        offsetX + x * 20,
                        offsetY + y * 20,
                        20,
                        20
                    );
                }
            }
        }
    }
    
    adjustColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    update(time = 0) {
        if (!this.gameStarted || this.gameOver || this.gamePaused) return;
        
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        
        this.dropCounter += deltaTime;
        const dropTime = Math.max(50, this.DROP_TIME - (this.level - 1) * 50);
        
        if (this.dropCounter > dropTime) {
            this.movePiece(0, 1);
            this.dropCounter = 0;
        }
        
        this.draw();
        requestAnimationFrame((time) => this.update(time));
    }
    
    togglePause() {
        if (!this.gameStarted || this.gameOver) return;
        
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseGame').textContent = 
            this.gamePaused ? '▶️ Resume' : '⏸️ Pause';
            
        if (!this.gamePaused) {
            this.lastTime = performance.now();
            requestAnimationFrame((time) => this.update(time));
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('level').textContent = this.level;
    }
    
    playSound(soundName) {
        if (this.soundEnabled && this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(() => {});
        }
    }
    
    showStartScreen() {
        this.ctx.fillStyle = '#000033';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('TETRIS', this.canvas.width/2, this.canvas.height/2 - 40);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Click Start Game to begin', this.canvas.width/2, this.canvas.height/2);
        
        this.ctx.font = '12px Arial';
        this.ctx.fillText('Arrow Keys: Move/Rotate', this.canvas.width/2, this.canvas.height/2 + 30);
        this.ctx.fillText('Space: Hard Drop', this.canvas.width/2, this.canvas.height/2 + 50);
        this.ctx.fillText('C: Hold Piece', this.canvas.width/2, this.canvas.height/2 + 70);
    }
    
    showGameOver() {
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        overlay.innerHTML = `
            <div class="game-over-content">
                <h2>Game Over!</h2>
                <p>Score: ${this.score}</p>
                <p>Lines: ${this.lines}</p>
                <p>Level: ${this.level}</p>
                <button class="game-button" onclick="location.reload()">Play Again</button>
            </div>
        `;
        document.body.appendChild(overlay);
        this.playSound('gameOver');
    }

    resizeCanvas() {
        const container = document.querySelector('.game-board');
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Make sure canvas is visible
        this.canvas.style.display = 'block';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        
        // Calculate proper canvas size for tetris board
        const boardWidth = this.BOARD_WIDTH * this.BLOCK_SIZE;
        const boardHeight = this.BOARD_HEIGHT * this.BLOCK_SIZE;
        
        // Center the game board
        this.offsetX = (this.canvas.width - boardWidth) / 2;
        this.offsetY = (this.canvas.height - boardHeight) / 2;
        
        // Resize next and hold canvases
        if (this.nextCanvas) {
            this.nextCanvas.width = 120;
            this.nextCanvas.height = 120;
        }
        if (this.holdCanvas) {
            this.holdCanvas.width = 120;
            this.holdCanvas.height = 120;
        }
        
        // Force a redraw if game is started
        if (this.gameStarted) {
            this.draw();
        }
    }
}

// Start the game when the page loads
window.onload = () => {
    new TetrisGame();
}; 