class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Atur dimensi kanvas berdasarkan kontainer
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Status permainan
        this.gameStarted = false;
        this.gameOver = false;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.level = 1;
        this.speed = 150; // Kecepatan awal dalam milidetik
        this.gamePaused = false;
        
        // Properti ular
        this.tileSize = 20; // Akan disesuaikan berdasarkan ukuran kanvas
        this.tileCount = {x: 20, y: 20}; // Akan disesuaikan berdasarkan ukuran kanvas
        this.snake = [{x: 10, y: 10}];
        this.velocityX = 0;
        this.velocityY = 0;
        this.nextDirection = 'right';
        
        // Makanan dan power-up
        this.food = this.getRandomPosition();
        this.powerUps = {
            speedBoost: 3,
            shield: 3,
            doublePoints: 3
        };
        this.activePowerUps = {
            speedBoost: false,
            shield: false,
            doublePoints: false
        };
        
        // Elemen antarmuka pengguna
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.levelElement = document.getElementById('level');
        this.startButton = document.getElementById('startGame');
        this.soundButton = document.getElementById('soundToggle');
        
        // Efek suara
        this.sounds = {
            eat: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...'),
            crash: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...'),
            powerUp: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...')
        };
        this.soundEnabled = true;
        
        // Loop permainan
        this.lastUpdate = 0;
        this.gameInterval = null;
        
        this.setupEventListeners();
        this.showStartScreen();
    }

    resizeCanvas() {
        const container = document.querySelector('.snake-board');
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Pastikan kanvas terlihat
        this.canvas.style.display = 'block';
        
        // Sesuaikan ukuran dan jumlah ubin berdasarkan dimensi kanvas
        // Ukuran dasar adalah 400x400 dengan 20x20 ubin
        const minTileSize = 15; // Ukuran ubin minimum untuk layar kecil
        
        // Hitung ukuran ubin baru berdasarkan dimensi kanvas
        this.tileSize = Math.min(
            Math.floor(this.canvas.width / 20), 
            Math.floor(this.canvas.height / 20)
        );
        
        // Pastikan ukuran ubin minimum
        this.tileSize = Math.max(this.tileSize, minTileSize);
        
        // Hitung jumlah ubin berdasarkan ukuran ubin baru
        this.tileCount = {
            x: Math.floor(this.canvas.width / this.tileSize),
            y: Math.floor(this.canvas.height / this.tileSize)
        };
        
        // Paksa menggambar ulang
        this.draw();
    }

    setupEventListeners() {
        // Kontrol papan ketik
        window.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Kontrol sentuh untuk perangkat mobile
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Cegah pengguliran
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Cegah pengguliran
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault(); // Cegah perilaku bawaan
            
            if (!this.gameStarted || this.gamePaused || this.gameOver) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Tentukan arah gesekan dengan sensitivitas tinggi
            if (Math.abs(deltaX) > Math.abs(deltaY) * 0.5) {
                // Gesekan horizontal
                if (deltaX > 20) {
                    this.setDirection('right');
                } else if (deltaX < -20) {
                    this.setDirection('left');
                }
            } else {
                // Gesekan vertikal
                if (deltaY > 20) {
                    this.setDirection('down');
                } else if (deltaY < -20) {
                    this.setDirection('up');
                }
            }
        });
        
        // Tombol kontrol permainan
        this.startButton.addEventListener('click', () => this.startGame());
        
        const pauseButton = document.getElementById('pauseGame');
        if (pauseButton) {
            pauseButton.addEventListener('click', () => this.togglePause());
        }
        
        this.soundButton.addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            this.soundButton.textContent = this.soundEnabled ? '🔊 Sound' : '🔇 Sound';
        });
        
        // Tombol power-up
        ['speedBoost', 'shield', 'doublePoints'].forEach(powerType => {
            const button = document.getElementById(powerType);
            if (button) {
                button.addEventListener('click', () => this.activatePowerUp(powerType));
            }
        });
        
        // Handle perubahan visibilitas tab browser
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.gameStarted && !this.gamePaused && !this.gameOver) {
                this.togglePause();
            }
        });
    }

    handleKeyPress(e) {
        if (this.gameOver) return;
        
        // Jika permainan belum dimulai, mulai dengan menekan tombol apapun
        if (!this.gameStarted) {
            this.startGame();
            return;
        }
        
        // Handle perubahan arah
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.setDirection('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.setDirection('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.setDirection('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.setDirection('right');
                break;
            case ' ': // Space bar
                this.togglePause();
                break;
        }
    }

    setDirection(newDirection) {
        // Cegah belok 180 derajat
        if (
            (this.velocityX !== 0 && newDirection === 'right') ||
            (this.velocityX !== 0 && newDirection === 'left') ||
            (this.velocityY !== 0 && newDirection === 'up') ||
            (this.velocityY !== 0 && newDirection === 'down')
        ) {
            return;
        }
        
        // Atur arah selanjutnya (akan diterapkan pada update berikutnya)
        this.nextDirection = newDirection;
    }

    startGame() {
        this.gameStarted = true;
        this.gameOver = false;
        this.score = 0;
        this.level = 1;
        this.snake = [{x: 10, y: 10}];
        this.velocityX = 1;
        this.velocityY = 0;
        this.food = this.getRandomPosition();
        this.powerUps = {
            speedBoost: 3,
            shield: 3,
            doublePoints: 3
        };
        this.activePowerUps = {
            speedBoost: false,
            shield: false,
            doublePoints: false
        };
        
        this.updateScore();
        this.startButton.style.display = 'none';
        this.gameLoop();
    }

    getRandomPosition() {
        return {
            x: Math.floor(Math.random() * this.tileCount.x),
            y: Math.floor(Math.random() * this.tileCount.y)
        };
    }

    spawnPowerUp() {
        if (Math.random() < 0.1 && this.powerUps.speedBoost < 3) {
            this.powerUps.speedBoost++;
        }
        if (Math.random() < 0.1 && this.powerUps.shield < 3) {
            this.powerUps.shield++;
        }
        if (Math.random() < 0.1 && this.powerUps.doublePoints < 3) {
            this.powerUps.doublePoints++;
        }
    }

    activatePowerUp(type) {
        this.activePowerUps[type] = true;
        this.playSound('powerUp');
        
        setTimeout(() => {
            this.activePowerUps[type] = false;
        }, 10000);
    }

    checkCollision(x, y) {
        // Check wall collision (unless ghost power-up is active)
        if (!this.activePowerUps.shield) {
            if (x < 0 || x >= this.tileCount.x || y < 0 || y >= this.tileCount.y) {
                return true;
            }
        } else {
            // Wrap around with shield power-up
            if (x < 0) x = this.tileCount.x - 1;
            if (x >= this.tileCount.x) x = 0;
            if (y < 0) y = this.tileCount.y - 1;
            if (y >= this.tileCount.y) y = 0;
        }

        // Check self collision
        for (let i = 0; i < this.snake.length; i++) {
            if (this.snake[i].x === x && this.snake[i].y === y) {
                return true;
            }
        }
        return false;
    }

    updateGame() {
        if (!this.gameStarted || this.gameOver) return;

        // Calculate new head position
        let newHead = {
            x: this.snake[0].x + this.velocityX,
            y: this.snake[0].y + this.velocityY
        };

        // Handle ghost power-up wall wrapping
        if (this.activePowerUps.shield) {
            if (newHead.x < 0) newHead.x = this.tileCount.x - 1;
            if (newHead.x >= this.tileCount.x) newHead.x = 0;
            if (newHead.y < 0) newHead.y = this.tileCount.y - 1;
            if (newHead.y >= this.tileCount.y) newHead.y = 0;
        }

        // Check collision
        if (this.checkCollision(newHead.x, newHead.y)) {
            this.gameOver = true;
            this.playSound('crash');
            this.showGameOver();
            return;
        }

        // Add new head
        this.snake.unshift(newHead);

        // Check food collision
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.getRandomPosition();
            this.playSound('eat');
            this.spawnPowerUp();
            
            // Level up every 100 points
            if (this.score % 100 === 0) {
                this.level++;
                this.levelElement.textContent = this.level;
                this.speed -= 50;
            }
        } else {
            this.snake.pop();
        }

        // Check power-up collision
        for (let type in this.powerUps) {
            if (newHead.x === this.food.x && newHead.y === this.food.y) {
                this.activatePowerUp(type);
            }
        }

        // Magnet power-up effect
        if (this.activePowerUps.doublePoints) {
            const distance = Math.sqrt(
                Math.pow(this.food.x - newHead.x, 2) + 
                Math.pow(this.food.y - newHead.y, 2)
            );
            if (distance < 5) {
                this.food.x += (newHead.x - this.food.x) * 0.1;
                this.food.y += (newHead.y - this.food.y) * 0.1;
            }
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.tileCount.x; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.tileSize, 0);
            this.ctx.lineTo(i * this.tileSize, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.tileSize);
            this.ctx.lineTo(this.canvas.width, i * this.tileSize);
            this.ctx.stroke();
        }

        // Draw snake
        this.snake.forEach((segment, index) => {
            const gradient = this.ctx.createRadialGradient(
                segment.x * this.tileSize + this.tileSize/2,
                segment.y * this.tileSize + this.tileSize/2,
                0,
                segment.x * this.tileSize + this.tileSize/2,
                segment.y * this.tileSize + this.tileSize/2,
                this.tileSize/2
            );
            
            if (index === 0) {
                gradient.addColorStop(0, '#4CAF50');
                gradient.addColorStop(1, '#45a049');
            } else {
                gradient.addColorStop(0, '#66BB6A');
                gradient.addColorStop(1, '#4CAF50');
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                segment.x * this.tileSize,
                segment.y * this.tileSize,
                this.tileSize - 2,
                this.tileSize - 2
            );
        });

        // Draw food with animation
        this.ctx.fillStyle = '#FF5252';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.tileSize + this.tileSize/2,
            this.food.y * this.tileSize + this.tileSize/2,
            this.tileSize/2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Draw power-ups
        for (let type in this.powerUps) {
            this.ctx.fillStyle = {
                speedBoost: '#FF9800',
                shield: '#9C27B0',
                doublePoints: '#2196F3'
            }[type];
            this.ctx.beginPath();
            this.ctx.arc(
                this.food.x * this.tileSize + this.tileSize/2,
                this.food.y * this.tileSize + this.tileSize/2,
                this.tileSize/2 - 2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            
            // Draw power-up icon
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            const icons = {
                speedBoost: '⚡',
                shield: '🛡',
                doublePoints: '🔢'
            };
            this.ctx.fillText(
                icons[type],
                this.food.x * this.tileSize + this.tileSize/2,
                this.food.y * this.tileSize + this.tileSize/2
            );
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = this.highScore;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
    }

    playSound(soundName) {
        if (this.soundEnabled && this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(() => {});
        }
    }

    showGameOver() {
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        overlay.innerHTML = `
            <div class="game-over-content">
                <h2>Game Over!</h2>
                <p>Score: ${this.score}</p>
                <p>High Score: ${this.highScore}</p>
                <p>Level: ${this.level}</p>
                <button class="game-button" onclick="location.reload()">Play Again</button>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    showStartScreen() {
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Snake Game', this.canvas.width/2, this.canvas.height/2 - 60);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Click Start Game or Press Space to begin', this.canvas.width/2, this.canvas.height/2);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Use arrow keys or on-screen buttons to control', this.canvas.width/2, this.canvas.height/2 + 40);
    }

    gameLoop() {
        if (!this.gameOver) {
            setTimeout(() => {
                this.updateGame();
                this.draw();
                requestAnimationFrame(() => this.gameLoop());
            }, 1000 / (this.speed + (this.activePowerUps.speedBoost ? 3 : 0)));
        }
    }

    togglePause() {
        this.gamePaused = !this.gamePaused;
        if (this.gamePaused) {
            clearInterval(this.gameInterval);
        } else {
            this.gameLoop();
        }
    }
}

// Start the game when the page loads
window.onload = () => {
    new SnakeGame();
}; 