const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variabel permainan
let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem('flappyHighScore') || 0;

// Objek burung
const bird = {
    x: 50,
    y: 250,
    velocity: 0,
    gravity: 0.5,
    jump: -8,
    size: 20
};

// Array pipa
let pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
const pipeSpeed = 2;

// Status permainan
let gameStarted = false;

// Inisialisasi
document.getElementById('highScore').textContent = highScore;
document.getElementById('status').textContent = 'Ready';

// Pendengar kejadian
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameRunning) {
            flap();
        } else if (gameStarted) {
            startGame();
        }
    }
});

canvas.addEventListener('click', function() {
    if (gameRunning) {
        flap();
    } else if (gameStarted) {
        startGame();
    }
});

// Kontrol perangkat mobile
document.getElementById('flapButton').addEventListener('click', function() {
    if (gameRunning) {
        flap();
    } else {
        startGame();
    }
});

document.getElementById('startGame').addEventListener('click', startGame);

// Tombol suara
let soundEnabled = true;
document.getElementById('soundToggle').addEventListener('click', function() {
    soundEnabled = !soundEnabled;
    this.textContent = soundEnabled ? '🔊 Sound' : '🔇 Sound';
});

function startGame() {
    gameRunning = true;
    gameStarted = true;
    score = 0;
    updateScore();
    document.getElementById('status').textContent = 'Playing';
    
    // Reset posisi burung
    bird.y = 250;
    bird.velocity = 0;
    
    // Bersihkan pipa
    pipes = [];
    
    // Sembunyikan layar game over
    document.getElementById('gameOver').style.display = 'none';
    
    // Mulai loop permainan
    gameLoop();
}

function flap() {
    bird.velocity = bird.jump;
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    
    // Check boundaries
    if (bird.y < 0 || bird.y + bird.size > canvas.height) {
        gameOver();
    }
}

function updatePipes() {
    // Add new pipe
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const pipeHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
        pipes.push({
            x: canvas.width,
            topHeight: pipeHeight,
            bottomY: pipeHeight + pipeGap,
            bottomHeight: canvas.height - (pipeHeight + pipeGap),
            passed: false
        });
    }
    
    // Update pipe positions
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;
        
        // Check if bird passed pipe
        if (!pipes[i].passed && pipes[i].x + pipeWidth < bird.x) {
            pipes[i].passed = true;
            score++;
            updateScore();
        }
        
        // Remove off-screen pipes
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
        
        // Check collision
        if (checkCollision(pipes[i])) {
            gameOver();
        }
    }
}

function checkCollision(pipe) {
    // Check if bird is within pipe x range
    if (bird.x + bird.size > pipe.x && bird.x < pipe.x + pipeWidth) {
        // Check if bird hits top or bottom pipe
        if (bird.y < pipe.topHeight || bird.y + bird.size > pipe.bottomY) {
            return true;
        }
    }
    return false;
}

function drawBird() {
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
    
    // Bird eye
    ctx.fillStyle = 'black';
    ctx.fillRect(bird.x + 15, bird.y + 5, 3, 3);
    
    // Bird beak
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(bird.x + bird.size, bird.y + 8, 8, 4);
}

function drawPipes() {
    ctx.fillStyle = '#228B22';
    
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, pipe.bottomHeight);
        
        // Pipe caps
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipeWidth + 10, 20);
        ctx.fillRect(pipe.x - 5, pipe.bottomY, pipeWidth + 10, 20);
        ctx.fillStyle = '#228B22';
    });
}

function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
        const x = (i * 100 + Date.now() * 0.02) % (canvas.width + 50) - 50;
        const y = 50 + i * 30;
        drawCloud(x, y);
    }
}

function drawCloud(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.arc(x + 15, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 30, y, 15, 0, Math.PI * 2);
    ctx.arc(x + 15, y - 10, 15, 0, Math.PI * 2);
    ctx.fill();
}

function updateScore() {
    document.getElementById('score').textContent = score;
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
}

function gameOver() {
    gameRunning = false;
    document.getElementById('status').textContent = 'Game Over';
    
    // Show game over screen
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'flex';
}

function restartGame() {
    startGame();
}

function gameLoop() {
    if (!gameRunning) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Update game objects
    updateBird();
    updatePipes();
    
    // Draw game objects
    drawPipes();
    drawBird();
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Initial draw
drawBackground();
drawBird(); 