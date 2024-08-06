import Box from '../GameObjects/Box.js';
import Enemy from '../GameObjects/Enemy.js';
import Star from '../GameObjects/Tower.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.spawnCount = 0;
        this.gold = 50;
        this.level = 0;
    }

    // 외부 파일 혹은 assets을 미리 불러오기 위한 작업 처리
    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('tower', 'assets/tower.png');
        this.load.image('projectile', 'assets/bomb.png');
        this.load.spritesheet('enemy', 'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    // 게임 시작시에 필요한 GameObject를 정의
    create() {
        const { width, height } = this.game.config;

        this.towers = this.add.group({
            runChildUpdate: true,
        });

        this.projectiles = this.add.group({
            runChildUpdate: true,
        });

        this.enemys = this.add.group({
            runChildUpdate: true,
        });

        this.grid = this.add.grid(width / 2, height / 2, width, height, width / 10, height / 10);
        this.grid.depth = -1;

        this.grid.data = {
            cells: [],
        };

        for (let i = 0; i < 10; i++) {
            this.grid.data.cells[i] = [];
            for (let j = 0; j < 10; j++) {
                this.grid.data.cells[i][j] = {
                    isTower: false,
                };
            }
        }

        this.grid.setInteractive();
        this.grid.on('pointerdown', (pointer) => {
            const cellWidth = width / 10;
            const cellHeight = height / 10;

            // 클릭한 좌표
            const { x, y } = pointer;

            const cellX = Math.floor(x / cellWidth) * cellWidth + cellWidth / 2;
            const cellY = Math.floor(y / cellHeight) * cellHeight + cellHeight / 2;

            if (
                Math.floor(x / cellWidth) === 0 ||
                Math.floor(x / cellWidth) === 9 ||
                Math.floor(y / cellHeight) === 0 ||
                Math.floor(y / cellHeight) === 9
            ) {
                return;
            }

            if (this.grid.data.cells[Math.floor(x / cellWidth)][Math.floor(y / cellHeight)].isTower) {
                return;
            }

            if (this.gold < 50) return;

            this.grid.data.cells[Math.floor(x / cellWidth)][Math.floor(y / cellHeight)].isTower = true;

            this.towers.add(new Star(this, cellX, cellY - 10));
            this.gold -= 50;
        });

        this.goldText = this.add.text(10, 10, `${this.gold} Gold`);
        this.spawnCountText = this.add.text(10, 20 + this.goldText.y, `${this.level + 1} Wave`);
        console.log(this.spawnCountText);
        this.enemyText = this.add.text(10, 20 + this.spawnCountText.y, `0 Enemys`);

        this.physics.add.overlap(this.enemys, this.projectiles, (enemy, projectile) => {
            if (!enemy.alive) return;
            projectile.destroy();

            if (projectile.type === 'explosion') {
                const explosionRadius = projectile.radius; // 폭발 범위

                // 폭발 범위 내 적들을 찾기
                this.enemys.getChildren().forEach((target) => {
                    if (!target.alive) return;

                    // 적의 위치와 폭발 중심 사이의 거리 계산
                    const distance = Phaser.Math.Distance.Between(projectile.x, projectile.y, target.x, target.y);
                    projectile.drawExplosionRange(this);

                    // 거리와 폭발 반경을 비교하여 폭발 범위 내 적인지 확인
                    if (distance <= explosionRadius) {
                        target.hit(projectile.damage); // 적에게 히트 처리
                        target.hp -= projectile.damage; // 적의 HP 감소

                        if (target.hp <= 0) {
                            target.die(); // 적이 죽었을 때 처리
                        }
                    }
                });
            } else {
                // 일반적인 프로젝타일 처리
                projectile.parent.killCount += 1;
                enemy.hit(projectile.damage);
                enemy.hp -= projectile.damage;

                if (enemy.hp <= 0) {
                    projectile.parent.closestObject = null;
                    enemy.die();
                }
            }
        });

        new Box(this, 0, 0);
        new Box(this, 1, 0);
        new Box(this, 2, 0);
        new Box(this, 3, 0);
        new Box(this, 4, 0);
        new Box(this, 5, 0);
        new Box(this, 6, 0);
        new Box(this, 7, 0);
        new Box(this, 8, 0);
        new Box(this, 9, 0);

        new Box(this, 9, 1);
        new Box(this, 9, 2);
        new Box(this, 9, 3);
        new Box(this, 9, 4);

        new Box(this, 0, 1);
        new Box(this, 0, 2);
        new Box(this, 0, 3);
        new Box(this, 0, 4);

        new Box(this, 9, 5);
        new Box(this, 8, 5);
        new Box(this, 7, 5);
        new Box(this, 6, 5);
        new Box(this, 5, 5);
        new Box(this, 4, 5);
        new Box(this, 3, 5);
        new Box(this, 2, 5);
        new Box(this, 1, 5);
        new Box(this, 0, 5);

        new Box(this, 9, 6);
        new Box(this, 8, 6);
        new Box(this, 7, 6);
        new Box(this, 6, 6);
        new Box(this, 5, 6);
        new Box(this, 4, 6);
        new Box(this, 3, 6);
        new Box(this, 2, 6);
        new Box(this, 1, 6);
        new Box(this, 0, 6);

        new Box(this, 9, 7);
        new Box(this, 8, 7);
        new Box(this, 7, 7);
        new Box(this, 6, 7);
        new Box(this, 5, 7);
        new Box(this, 4, 7);
        new Box(this, 3, 7);
        new Box(this, 2, 7);
        new Box(this, 1, 7);
        new Box(this, 0, 7);

        new Box(this, 9, 8);
        new Box(this, 8, 8);
        new Box(this, 7, 8);
        new Box(this, 6, 8);
        new Box(this, 5, 8);
        new Box(this, 4, 8);
        new Box(this, 3, 8);
        new Box(this, 2, 8);
        new Box(this, 1, 8);
        new Box(this, 0, 8);

        new Box(this, 9, 9);
        new Box(this, 8, 9);
        new Box(this, 7, 9);
        new Box(this, 6, 9);
        new Box(this, 5, 9);
        new Box(this, 4, 9);
        new Box(this, 3, 9);
        new Box(this, 2, 9);
        new Box(this, 1, 9);
        new Box(this, 0, 9);

        new Box(this, 2, 2);
        new Box(this, 3, 2);
        new Box(this, 4, 2);
        new Box(this, 5, 2);
        new Box(this, 6, 2);
        new Box(this, 7, 2);

        new Box(this, 2, 3);
        new Box(this, 3, 3);
        new Box(this, 4, 3);
        new Box(this, 5, 3);
        new Box(this, 6, 3);
        new Box(this, 7, 3);

        this.spwanWave();
    }

    spwanWave() {
        let waveEnemy = 1;
        this.enemys.add(new Enemy(this, 0, 0, { level: this.level }));
        this.spwanTimer = setInterval(() => {
            if (waveEnemy < 20) {
                waveEnemy += 1;
                this.enemys.add(new Enemy(this, 0, 0, { level: this.level }));
            } else {
                clearInterval(this.spwanTimer);
                this.waveTimer = setTimeout(() => {
                    this.level += 1;
                    this.spwanWave();
                }, 10000);
            }
        }, 250);
    }

    update() {
        this.goldText.text = `${this.gold.toLocaleString()} Gold`;
        this.spawnCountText.text = `${(this.level + 1).toLocaleString()} Wave`;
        this.enemyText.text = `${this.enemys.getChildren().length.toLocaleString()} Enemys`;

        if (this.enemys.getChildren().length === 0 && this.waveTimer) {
            clearTimeout(this.waveTimer);
            this.level += 1;
            this.spwanWave();
        }
    }
}

export default MainScene;
