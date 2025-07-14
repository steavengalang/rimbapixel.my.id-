class TowerDefense {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Atur ukuran kanvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Status permainan
        this.gameStarted = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.gold = 100;
        this.lives = 20;
        this.wave = 1;
        this.score = 0;
        this.waveInProgress = false;
        this.selectedTowerType = null;
        this.selectedTower = null;
        
        // Properti markas
        this.base = {
            x: 0, // Akan diatur oleh resizeCanvas
            y: 0, // Akan diatur oleh resizeCanvas  
            health: 100,
            maxHealth: 100,
            size: 40
        };
        
        // Objek permainan
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.path = []; // Akan diatur oleh resizeCanvas
        
        // Kemampuan khusus
        this.powerUps = {
            airStrike: 3,
            freeze: 3,
            repair: 3
        };
        
        // Definisi menara
        this.towerTypes = {
            basic: {
                cost: 10,
                damage: 10,
                range: 80,
                fireRate: 500,
                color: '#4CAF50',
                projectileSpeed: 8
            },
            cannon: {
                cost: 25,
                damage: 40,
                range: 70,
                fireRate: 1200,
                color: '#FF5722',
                projectileSpeed: 6,
                splash: true
            },
            ice: {
                cost: 20,
                damage: 5,
                range: 90,
                fireRate: 800,
                color: '#2196F3',
                projectileSpeed: 7,
                slow: true
            },
            laser: {
                cost: 40,
                damage: 25,
                range: 100,
                fireRate: 100,
                color: '#9C27B0',
                projectileSpeed: 15,
                piercing: true
            }
        };
        
        // Jenis musuh
        this.enemyTypes = {
            basic: {
                health: 30,
                speed: 1.5,
                reward: 2,
                color: '#FF4444'
            },
            fast: {
                health: 20,
                speed: 3,
                reward: 3,
                color: '#44FF44'
            },
            tank: {
                health: 80,
                speed: 0.8,
                reward: 5,
                color: '#4444FF'
            },
            flying: {
                health: 25,
                speed: 2,
                reward: 4,
                color: '#FFFF44',
                flying: true
            }
        };
        
        // Efek suara
        this.sounds = {
            shoot: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...'),
            hit: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...'),
            build: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...'),
            upgrade: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...'),
            enemyKilled: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...'),
            waveComplete: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...'),
            gameOver: new Audio('data:audio/wav;base64,UklGRl9vAAAWAVZFUk...')
        };
        this.soundEnabled = true;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.showStartScreen();
    }
    
    setupEventListeners() {
        // Klik canvas untuk penempatan tower
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // Pemilihan tower
        document.querySelectorAll('.tower-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectTowerType(card.dataset.tower);
            });
        });
        
        // Kontrol permainan
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('pauseGame').addEventListener('click', () => this.togglePause());
        document.getElementById('soundToggle').addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            document.getElementById('soundToggle').textContent = 
                this.soundEnabled ? '🔊 Sound' : '🔇 Sound';
        });
        document.getElementById('nextWave').addEventListener('click', () => this.startNextWave());
        
        // Power-up
        document.getElementById('airStrike').addEventListener('click', () => this.activatePowerUp('airStrike'));
        document.getElementById('freeze').addEventListener('click', () => this.activatePowerUp('freeze'));
        document.getElementById('repair').addEventListener('click', () => this.activatePowerUp('repair'));
        
        // Upgrade
        document.getElementById('upgradeDamage').addEventListener('click', () => this.upgradeTower('damage'));
        document.getElementById('upgradeRange').addEventListener('click', () => this.upgradeTower('range'));
        document.getElementById('upgradeSpeed').addEventListener('click', () => this.upgradeTower('speed'));
        document.getElementById('sellTower').addEventListener('click', () => this.sellTower());
    }
    
    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.gameOver = false;
        this.gold = 100;
        this.lives = 20;
        this.wave = 1;
        this.score = 0;
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        
        // Reset kesehatan base
        this.base.health = this.base.maxHealth;
        
        document.getElementById('startGame').style.display = 'none';
        document.getElementById('nextWave').disabled = false;
        this.updateUI();
        this.enablePowerUps();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    selectTowerType(type) {
        // Hapus pilihan sebelumnya
        document.querySelectorAll('.tower-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        this.selectedTowerType = type;
        this.selectedTower = null;
        document.querySelector(`[data-tower="${type}"]`).classList.add('selected');
        this.hideTowerUpgrades();
    }
    
    handleCanvasClick(e) {
        if (!this.gameStarted || this.gamePaused || this.gameOver) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Cek jika mengklik tower yang sudah ada
        const clickedTower = this.towers.find(tower => {
            const dx = tower.x - x;
            const dy = tower.y - y;
            return Math.sqrt(dx * dx + dy * dy) < 20;
        });
        
        if (clickedTower) {
            this.selectTower(clickedTower);
            return;
        }
        
        // Tempatkan tower baru
        if (this.selectedTowerType && this.canPlaceTower(x, y)) {
            this.placeTower(x, y);
        }
    }
    
    canPlaceTower(x, y) {
        // Cek jika posisi ada di jalur
        if (this.isOnPath(x, y)) return false;
        
        // Cek jika terlalu dekat dengan tower lain
        for (const tower of this.towers) {
            const dx = tower.x - x;
            const dy = tower.y - y;
            if (Math.sqrt(dx * dx + dy * dy) < 40) return false;
        }
        
        // Cek jika punya cukup emas
        const cost = this.towerTypes[this.selectedTowerType].cost;
        return this.gold >= cost;
    }
    
    isOnPath(x, y) {
        const pathWidth = 30;
        for (let i = 0; i < this.path.length - 1; i++) {
            const start = this.path[i];
            const end = this.path[i + 1];
            
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            const unitX = dx / length;
            const unitY = dy / length;
            
            for (let j = 0; j <= length; j += 5) {
                const pathX = start.x + unitX * j;
                const pathY = start.y + unitY * j;
                
                const distanceToPath = Math.sqrt((x - pathX) ** 2 + (y - pathY) ** 2);
                if (distanceToPath < pathWidth) return true;
            }
        }
        return false;
    }
    
    placeTower(x, y) {
        const towerData = this.towerTypes[this.selectedTowerType];
        const cost = towerData.cost;
        
        if (this.gold >= cost) {
            const tower = {
                x: x,
                y: y,
                type: this.selectedTowerType,
                ...towerData,
                lastFired: 0,
                level: 1,
                totalCost: cost
            };
            
            this.towers.push(tower);
            this.gold -= cost;
            this.updateUI();
            this.playSound('build');
        }
    }
    
    selectTower(tower) {
        this.selectedTower = tower;
        this.selectedTowerType = null;
        
        // Hapus pilihan jenis tower
        document.querySelectorAll('.tower-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        this.showTowerUpgrades();
    }
    
    showTowerUpgrades() {
        const upgradePanel = document.getElementById('towerUpgrades');
        upgradePanel.style.display = 'block';
        
        // Update upgrade costs
        const baseCost = this.towerTypes[this.selectedTower.type].cost;
        const level = this.selectedTower.level;
        
        document.querySelector('#upgradeDamage .upgrade-cost').textContent = `$${Math.floor(baseCost * 0.6 * level)}`;
        document.querySelector('#upgradeRange .upgrade-cost').textContent = `$${Math.floor(baseCost * 0.5 * level)}`;
        document.querySelector('#upgradeSpeed .upgrade-cost').textContent = `$${Math.floor(baseCost * 0.4 * level)}`;
        document.querySelector('#sellTower .upgrade-cost').textContent = `$${Math.floor(this.selectedTower.totalCost * 0.5)}`;
    }
    
    hideTowerUpgrades() {
        document.getElementById('towerUpgrades').style.display = 'none';
    }
    
    upgradeTower(type) {
        if (!this.selectedTower) return;
        
        const baseCost = this.towerTypes[this.selectedTower.type].cost;
        const level = this.selectedTower.level;
        let cost;
        
        switch(type) {
            case 'damage':
                cost = Math.floor(baseCost * 0.6 * level);
                if (this.gold >= cost) {
                    this.gold -= cost;
                    this.selectedTower.damage = Math.floor(this.selectedTower.damage * 1.5);
                    this.selectedTower.level++;
                    this.selectedTower.totalCost += cost;
                }
                break;
            case 'range':
                cost = Math.floor(baseCost * 0.5 * level);
                if (this.gold >= cost) {
                    this.gold -= cost;
                    this.selectedTower.range = Math.floor(this.selectedTower.range * 1.3);
                    this.selectedTower.level++;
                    this.selectedTower.totalCost += cost;
                }
                break;
            case 'speed':
                cost = Math.floor(baseCost * 0.4 * level);
                if (this.gold >= cost) {
                    this.gold -= cost;
                    this.selectedTower.fireRate = Math.floor(this.selectedTower.fireRate * 0.7);
                    this.selectedTower.level++;
                    this.selectedTower.totalCost += cost;
                }
                break;
        }
        
        this.updateUI();
        this.showTowerUpgrades();
        this.playSound('upgrade');
    }
    
    sellTower() {
        if (!this.selectedTower) return;
        
        const sellPrice = Math.floor(this.selectedTower.totalCost * 0.5);
        this.gold += sellPrice;
        
        this.towers = this.towers.filter(tower => tower !== this.selectedTower);
        this.selectedTower = null;
        this.hideTowerUpgrades();
        this.updateUI();
    }
    
    startNextWave() {
        if (this.waveInProgress) return;
        
        this.waveInProgress = true;
        document.getElementById('nextWave').disabled = true;
        
        const enemyCount = 5 + this.wave * 2;
        let enemiesSpawned = 0;
        
        const spawnInterval = setInterval(() => {
            if (enemiesSpawned >= enemyCount) {
                clearInterval(spawnInterval);
                return;
            }
            
            this.spawnEnemy();
            enemiesSpawned++;
        }, 1000);
    }
    
    spawnEnemy() {
        const waveProgress = this.wave / 10;
        let type = 'basic';
        
        const rand = Math.random();
        if (rand < 0.1 + waveProgress * 0.1) type = 'flying';
        else if (rand < 0.2 + waveProgress * 0.1) type = 'tank';
        else if (rand < 0.4 + waveProgress * 0.2) type = 'fast';
        
        const enemyData = this.enemyTypes[type];
        const healthMultiplier = 1 + (this.wave - 1) * 0.2;
        
        const enemy = {
            x: this.path[0].x,
            y: this.path[0].y,
            type: type,
            health: enemyData.health * healthMultiplier,
            maxHealth: enemyData.health * healthMultiplier,
            speed: enemyData.speed,
            reward: enemyData.reward,
            color: enemyData.color,
            flying: enemyData.flying || false,
            pathIndex: 0,
            pathProgress: 0,
            slowEffect: 0
        };
        
        this.enemies.push(enemy);
    }
    
    activatePowerUp(type) {
        if (this.powerUps[type] <= 0) return;
        
        this.powerUps[type]--;
        
        switch(type) {
            case 'airStrike':
                this.executeAirStrike();
                break;
            case 'freeze':
                this.freezeEnemies();
                break;
            case 'repair':
                this.repairBase();
                break;
        }
        
        this.updatePowerUpButtons();
        this.playSound('upgrade');
    }
    
    executeAirStrike() {
        // Berikan kerusakan ke semua musuh
        this.enemies.forEach(enemy => {
            enemy.health -= 30;
            this.createHitEffect(enemy.x, enemy.y);
        });
    }
    
    freezeEnemies() {
        // Perlambat semua musuh selama 5 detik
        this.enemies.forEach(enemy => {
            enemy.slowEffect = Math.max(enemy.slowEffect, 5000);
        });
    }
    
    repairBase() {
        // Pulihkan nyawa dan kesehatan markas
        this.lives = Math.min(20, this.lives + 5);
        this.base.health = Math.min(this.base.health + 20, this.base.maxHealth);
        
        // Buat efek perbaikan
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: this.base.x + (Math.random() - 0.5) * 40,
                y: this.base.y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 60,
                maxLife: 60,
                color: '#00ff00',
                size: 3
            });
        }
        
        this.updateUI();
    }
    
    gameLoop() {
        if (!this.gameStarted || this.gameOver || this.gamePaused) return;
        
        this.updateEnemies();
        this.updateTowers();
        this.updateProjectiles();
        this.updateParticles();
        this.checkWaveComplete();
        this.draw();
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Update slow effect
            if (enemy.slowEffect > 0) {
                enemy.slowEffect -= 16; // Assuming 60 FPS
            }
            
            // Move enemy along path
            const speed = enemy.speed * (enemy.slowEffect > 0 ? 0.3 : 1);
            this.moveEnemyAlongPath(enemy, speed);
            
            // Check if enemy reached the base
            if (enemy.pathIndex >= this.path.length - 1) {
                this.enemies.splice(i, 1);
                this.lives--;
                this.base.health -= 10; // Base takes damage
                
                // Create damage effect at base
                this.createHitEffect(this.base.x, this.base.y);
                
                this.updateUI();
                
                if (this.lives <= 0 || this.base.health <= 0) {
                    this.gameOver = true;
                    this.showGameOver();
                }
                continue;
            }
            
            // Remove dead enemies
            if (enemy.health <= 0) {
                this.enemies.splice(i, 1);
                this.gold += enemy.reward;
                this.score += enemy.reward * 10;
                this.createDeathEffect(enemy.x, enemy.y);
                this.playSound('enemyKilled');
                this.updateUI();
            }
        }
    }
    
    moveEnemyAlongPath(enemy, speed) {
        if (enemy.pathIndex >= this.path.length - 1) return;
        
        const currentPoint = this.path[enemy.pathIndex];
        const nextPoint = this.path[enemy.pathIndex + 1];
        
        const dx = nextPoint.x - currentPoint.x;
        const dy = nextPoint.y - currentPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        enemy.pathProgress += speed / distance;
        
        if (enemy.pathProgress >= 1) {
            enemy.pathProgress = 0;
            enemy.pathIndex++;
            if (enemy.pathIndex < this.path.length - 1) {
                enemy.x = this.path[enemy.pathIndex].x;
                enemy.y = this.path[enemy.pathIndex].y;
            }
        } else {
            enemy.x = currentPoint.x + dx * enemy.pathProgress;
            enemy.y = currentPoint.y + dy * enemy.pathProgress;
        }
    }
    
    updateTowers() {
        const currentTime = Date.now();
        
        this.towers.forEach(tower => {
            if (currentTime - tower.lastFired >= tower.fireRate) {
                const target = this.findTarget(tower);
                if (target) {
                    this.fireTower(tower, target);
                    tower.lastFired = currentTime;
                }
            }
        });
    }
    
    findTarget(tower) {
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        this.enemies.forEach(enemy => {
            // Skip flying enemies for non-laser towers
            if (enemy.flying && tower.type !== 'laser') return;
            
            const dx = enemy.x - tower.x;
            const dy = enemy.y - tower.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= tower.range && distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });
        
        return closestEnemy;
    }
    
    fireTower(tower, target) {
        const projectile = {
            x: tower.x,
            y: tower.y,
            targetX: target.x,
            targetY: target.y,
            target: target,
            damage: tower.damage,
            speed: tower.projectileSpeed,
            color: tower.color,
            type: tower.type
        };
        
        // Calculate direction
        const dx = target.x - tower.x;
        const dy = target.y - tower.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        projectile.vx = (dx / distance) * tower.projectileSpeed;
        projectile.vy = (dy / distance) * tower.projectileSpeed;
        
        this.projectiles.push(projectile);
        this.playSound('shoot');
    }
    
    updateProjectiles() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            projectile.x += projectile.vx;
            projectile.y += projectile.vy;
            
            // Check collision with target or any enemy
            let hit = false;
            for (const enemy of this.enemies) {
                const dx = enemy.x - projectile.x;
                const dy = enemy.y - projectile.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 15) {
                    this.hitEnemy(enemy, projectile);
                    hit = true;
                    
                    // Piercing projectiles continue
                    if (!this.towerTypes[projectile.type].piercing) {
                        break;
                    }
                }
            }
            
            // Remove projectile if it hit (and not piercing) or went off screen
            if ((hit && !this.towerTypes[projectile.type].piercing) ||
                projectile.x < 0 || projectile.x > this.canvas.width ||
                projectile.y < 0 || projectile.y > this.canvas.height) {
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    hitEnemy(enemy, projectile) {
        enemy.health -= projectile.damage;
        this.createHitEffect(enemy.x, enemy.y);
        
        // Apply special effects
        if (this.towerTypes[projectile.type].slow) {
            enemy.slowEffect = Math.max(enemy.slowEffect, 2000);
        }
        
        if (this.towerTypes[projectile.type].splash) {
            // Splash damage to nearby enemies
            this.enemies.forEach(otherEnemy => {
                if (otherEnemy !== enemy) {
                    const dx = otherEnemy.x - enemy.x;
                    const dy = otherEnemy.y - enemy.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 50) {
                        otherEnemy.health -= projectile.damage * 0.5;
                        this.createHitEffect(otherEnemy.x, otherEnemy.y);
                    }
                }
            });
        }
        
        this.playSound('hit');
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.alpha -= 0.02;
            particle.size *= 0.98;
            
            if (particle.alpha <= 0 || particle.size <= 0.5) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    checkWaveComplete() {
        if (this.waveInProgress && this.enemies.length === 0) {
            this.waveInProgress = false;
            this.wave++;
            this.gold += 10 + this.wave * 2;
            this.score += 100;
            
            document.getElementById('nextWave').disabled = false;
            this.updateUI();
            this.playSound('waveComplete');
        }
    }
    
    createHitEffect(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 3 + 2,
                alpha: 1,
                color: '#ff4444'
            });
        }
    }
    
    createDeathEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: Math.random() * 5 + 3,
                alpha: 1,
                color: '#ffff44'
            });
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#2d5a3d';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw path
        this.drawPath();
        
        // Draw base
        this.drawBase();
        
        // Draw towers
        this.towers.forEach(tower => this.drawTower(tower));
        
        // Draw enemies
        this.enemies.forEach(enemy => this.drawEnemy(enemy));
        
        // Draw projectiles
        this.projectiles.forEach(projectile => this.drawProjectile(projectile));
        
        // Draw particles
        this.particles.forEach(particle => this.drawParticle(particle));
        
        // Draw tower range if selected
        if (this.selectedTower) {
            this.drawTowerRange(this.selectedTower);
        }
        
        // Draw placement preview
        if (this.selectedTowerType) {
            this.drawPlacementPreview();
        }
    }
    
    drawPath() {
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 30;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.stroke();
    }
    
    drawBase() {
        const size = this.base.size;
        const x = this.base.x;
        const y = this.base.y;
        
        // Draw triangular base
        this.ctx.fillStyle = '#2E7D32';
        this.ctx.strokeStyle = '#1B5E20';
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size/2);          // Top point
        this.ctx.lineTo(x - size/2, y + size/2); // Bottom left
        this.ctx.lineTo(x + size/2, y + size/2); // Bottom right
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw base details (flag)
        this.ctx.fillStyle = '#FF0000';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size/2);
        this.ctx.lineTo(x, y - size);
        this.ctx.lineTo(x + 15, y - size + 5);
        this.ctx.lineTo(x, y - size + 10);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw flagpole
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size/2);
        this.ctx.lineTo(x, y - size);
        this.ctx.stroke();
        
        // Draw health bar
        const barWidth = 50;
        const barHeight = 6;
        const healthPercent = this.base.health / this.base.maxHealth;
        
        // Background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x - barWidth/2, y - size - 15, barWidth, barHeight);
        
        // Health bar
        if (healthPercent > 0.6) {
            this.ctx.fillStyle = '#4CAF50';
        } else if (healthPercent > 0.3) {
            this.ctx.fillStyle = '#FF9800';
        } else {
            this.ctx.fillStyle = '#F44336';
        }
        this.ctx.fillRect(x - barWidth/2, y - size - 15, barWidth * healthPercent, barHeight);
        
        // Health text
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`BASE: ${Math.ceil(this.base.health)}/${this.base.maxHealth}`, x, y + size + 15);
    }
    
    drawTower(tower) {
        // Tower base
        this.ctx.fillStyle = tower.color;
        this.ctx.beginPath();
        this.ctx.arc(tower.x, tower.y, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Tower border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Level indicator
        if (tower.level > 1) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(tower.level, tower.x, tower.y + 4);
        }
        
        // Selection highlight
        if (tower === this.selectedTower) {
            this.ctx.strokeStyle = '#ffff00';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(tower.x, tower.y, 18, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    drawTowerRange(tower) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawEnemy(enemy) {
        // Enemy body
        this.ctx.fillStyle = enemy.color;
        this.ctx.beginPath();
        this.ctx.arc(enemy.x, enemy.y, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Health bar
        const barWidth = 20;
        const barHeight = 4;
        const healthPercent = enemy.health / enemy.maxHealth;
        
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(enemy.x - barWidth/2, enemy.y - 20, barWidth, barHeight);
        
        this.ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FF9800' : '#F44336';
        this.ctx.fillRect(enemy.x - barWidth/2, enemy.y - 20, barWidth * healthPercent, barHeight);
        
        // Slow effect
        if (enemy.slowEffect > 0) {
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Flying indicator
        if (enemy.flying) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y - 5, 8, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawProjectile(projectile) {
        this.ctx.fillStyle = projectile.color;
        this.ctx.beginPath();
        this.ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawParticle(particle) {
        this.ctx.globalAlpha = particle.alpha;
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }
    
    drawPlacementPreview() {
        // Get mouse position (would need to track this)
        // For now, just show that a tower type is selected
    }
    
    updateUI() {
        document.getElementById('gold').textContent = this.gold;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('wave').textContent = this.wave;
        document.getElementById('score').textContent = this.score;
    }
    
    updatePowerUpButtons() {
        Object.keys(this.powerUps).forEach(type => {
            const button = document.getElementById(type);
            const count = this.powerUps[type];
            
            button.disabled = count <= 0;
            button.querySelector('.power-up-text').textContent = 
                `${type.charAt(0).toUpperCase() + type.slice(1)} (${count})`;
        });
    }
    
    enablePowerUps() {
        this.updatePowerUpButtons();
    }
    
    togglePause() {
        if (!this.gameStarted || this.gameOver) return;
        
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseGame').textContent = 
            this.gamePaused ? '▶️ Resume' : '⏸️ Pause';
            
        if (!this.gamePaused) {
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }
    
    playSound(soundName) {
        if (this.soundEnabled && this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(() => {});
        }
    }
    
    showStartScreen() {
        this.ctx.fillStyle = '#2d5a3d';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Tower Defense', this.canvas.width/2, this.canvas.height/2 - 40);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Click Start Game to begin', this.canvas.width/2, this.canvas.height/2 + 20);
        
        this.ctx.font = '14px Arial';
        this.ctx.fillText('Build towers to defend against enemy waves', this.canvas.width/2, this.canvas.height/2 + 50);
    }
    
    showGameOver() {
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        overlay.innerHTML = `
            <div class="game-over-content">
                <h2>Game Over!</h2>
                <p>Score: ${this.score}</p>
                <p>Waves Survived: ${this.wave - 1}</p>
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
        
        // Set longer path based on canvas size
        this.path = [
            {x: 0, y: this.canvas.height * 0.7},
            {x: this.canvas.width * 0.15, y: this.canvas.height * 0.7},
            {x: this.canvas.width * 0.15, y: this.canvas.height * 0.3},
            {x: this.canvas.width * 0.35, y: this.canvas.height * 0.3},
            {x: this.canvas.width * 0.35, y: this.canvas.height * 0.8},
            {x: this.canvas.width * 0.55, y: this.canvas.height * 0.8},
            {x: this.canvas.width * 0.55, y: this.canvas.height * 0.2},
            {x: this.canvas.width * 0.75, y: this.canvas.height * 0.2},
            {x: this.canvas.width * 0.75, y: this.canvas.height * 0.6},
            {x: this.canvas.width * 0.9, y: this.canvas.height * 0.6},
            {x: this.canvas.width * 0.9, y: this.canvas.height * 0.4},
            {x: this.canvas.width - 50, y: this.canvas.height * 0.4}
        ];
        
        // Set base position at the end of path
        this.base.x = this.canvas.width - 50;
        this.base.y = this.canvas.height * 0.4;
        
        // Force a redraw if game is started
        if (this.gameStarted) {
            this.draw();
        }
    }
}

// Start the game when the page loads
window.onload = () => {
    new TowerDefense();
}; 