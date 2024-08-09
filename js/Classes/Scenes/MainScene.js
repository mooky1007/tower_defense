import Box from '../GameObjects/Box.js';
import DecoTile from '../GameObjects/DecoTile.js';
import Enemy from '../GameObjects/Enemy.js';
import Star from '../GameObjects/Tower.js';
import ZoneTile from '../GameObjects/Zone.js';
import GameScreen from '../GameScreen.js';
import TowerUI from '../UI/TowerUI.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.spawnCount = 0;
        this.gold = 100;

        this.level = 0;
    }

    preload() {
        this.load.spritesheet('tower', 'assets/tower/1.png', {
            frameWidth: 70,
            frameHeight: 130,
        });

        this.load.image('projectile', 'assets/arrow.png');
        this.load.image('grass', 'assets/tileset/FieldsTile_38.png');
        this.load.image('dirty01', 'assets/tileset/FieldsTile_30.png');
        this.load.image('dirty02', 'assets/tileset/FieldsTile_28.png');
        this.load.image('dirty03', 'assets/tileset/FieldsTile_32.png');
        this.load.image('dirty04', 'assets/tileset/FieldsTile_26.png');
        this.load.image('dirty05', 'assets/tileset/FieldsTile_10.png');
        this.load.image('dirty06', 'assets/tileset/FieldsTile_12.png');

        this.load.image('grass01', 'assets/grass/1.png');
        this.load.image('grass02', 'assets/grass/2.png');
        this.load.image('grass03', 'assets/grass/3.png');
        this.load.image('grass04', 'assets/grass/4.png');
        this.load.image('grass05', 'assets/grass/5.png');
        this.load.image('grass06', 'assets/grass/6.png');

        this.load.spritesheet('slime', 'assets/S_Walk.png', {
            frameWidth: 48,
            frameHeight: 48,
        });
        this.load.spritesheet('slime_death', 'assets/S_Death.png', {
            frameWidth: 48,
            frameHeight: 48,
        });
    }

    create() {
        const {
            config: { width },
            tile,
        } = this.game;
        this.zones = this.add.group();
        this.towers = this.add.group();
        this.projectiles = this.add.group();
        this.enemys = this.add.group();

        this.gameScreen = new GameScreen(this, 0, tile.height);

        this.topArea = this.add.zone(0, 0, width, this.game.tile.width);
        this.topArea.setOrigin(0, 0);
        this.physics.add.existing(this.topArea);
        this.topArea.body.allowGravity = false;
        this.topArea.body.immovable = true;
        this.physics.add.collider(this.enemys, this.topArea);
        this.physics.add.collider(this.projectiles, this.topArea, (projectile) => projectile.destroy());

        this.bottomArea = this.add.zone(0, this.game.tile.height * 12, width, this.game.tile.height * 4);
        this.bottomArea.setOrigin(0, 0);
        this.physics.add.existing(this.bottomArea);
        this.bottomArea.body.allowGravity = false;
        this.bottomArea.body.immovable = true;
        this.physics.add.collider(this.enemys, this.bottomArea);
        this.physics.add.collider(this.projectiles, this.bottomArea, (projectile) => projectile.destroy());
        this.physics.add.collider(this.enemys, this.zones)
        this.towers.runChildUpdate = true;
        this.projectiles.runChildUpdate = true;
        this.enemys.runChildUpdate = true;

        this.goldText = this.add.text(width - 20, 10, `${this.gold} Gold`);
        this.goldText.setOrigin(1, 0);
        this.spawnCountText = this.add.text(10, 10, `${this.level + 1} Wave`);
        this.enemyText = this.add.text(10, 20 + this.spawnCountText.y, `0 Enemys`);

        this.physics.add.overlap(this.enemys, this.projectiles, (enemy, projectile) => {
            if (!enemy.alive) return;

            const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, projectile.x, projectile.y);
            const thresholdDistance = 24;

            if (distance <= thresholdDistance) {
                projectile.destroy();
                if (projectile.type === 'explosion') {
                    const explosionRadius = projectile.radius; // 폭발 범위

                    // 폭발 범위 내 적들을 찾기
                    projectile.drawExplosionRange(this, enemy);
                    this.enemys.getChildren().forEach((target) => {
                        if (!target.alive) return;

                        // 적의 위치와 폭발 중심 사이의 거리 계산
                        const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, target.x, target.y);

                        // 거리와 폭발 반경을 비교하여 폭발 범위 내 적인지 확인
                        if (distance <= explosionRadius) {
                            target.hit(projectile); // 적에게 히트 처리
                            target.hp -= projectile.damage; // 적의 HP 감소
                            target.update();

                            if (target.hp <= 0) {
                                projectile.parent.killCount += 1;
                                target.die(); // 적이 죽었을 때 처리
                            }
                        }
                    });
                } else {
                    // 일반적인 프로젝타일 처리
                    enemy.hit(projectile);
                    enemy.hp -= projectile.damage;
                    enemy.update();

                    if (enemy.hp <= 0) {
                        projectile.parent.killCount += 1;
                        enemy.die();
                    }
                }
            }
        });

        // this.enemys.add(new Enemy(this, 0, 0, { level: this.level }));
        this.spwanWave();
    }

    spwanWave() {
        let waveEnemy = 1;
        this.enemys.add(new Enemy(this, 0, 0, { level: this.level }));
        this.spwanTimer = setInterval(() => {
            if (waveEnemy < 25 + this.level * 5) {
                waveEnemy += 1;
                this.enemys.add(new Enemy(this, 0, 0, { level: this.level }));
            } else {
                clearInterval(this.spwanTimer);
                this.waveTimer = setTimeout(() => {
                    this.level += 1;
                    this.spwanWave();
                }, 30000);
            }
        }, 500);
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
        // if (this.enemys.getChildren().length > 40) {
        //     this.gameover();
        // }
    }

    // gameover() {
    //     const rect = this.add.rectangle(0, this.game.tile.height, this.game.tile.width * 11, this.game.tile.height * 11, 0x000000, 0.8);
    //     rect.setOrigin(0, 0);
    //     this.add.text(rect.x + rect.width / 2, rect.y + rect.height / 2, 'Game Over', { color: '#fff', fontSize: 24 }).setOrigin(0.5, 0.5);

    //     console.log(this);
    //     const a = this.add.dom(400, 400, 'div', 'background-color: lime; width: 220px; height: 100px; font: 48px Arial', 'Phaser');
    //     console.log();

    //     rect.setInteractive();

    //     rect.on(
    //         'pointerdown',
    //         () => {
    //             this.scene.restart();
    //         },
    //         this
    //     );

    //     this.scene.pause();
    // }
}

export default MainScene;
