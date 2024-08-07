import Box from '../GameObjects/Box.js';
import DecoTile from '../GameObjects/DecoTile.js';
import Enemy from '../GameObjects/Enemy.js';
import Star from '../GameObjects/Tower.js';
import ZoneTile from '../GameObjects/Zone.js';
import TowerUI from '../UI/TowerUI.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.spawnCount = 0;
        this.gold = 500000;
        this.level = 0;
    }

    // 외부 파일 혹은 assets을 미리 불러오기 위한 작업 처리
    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('tower', 'assets/tower/3.png', {
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
        const { width, height } = this.game.config;

        const background = this.add.image(0, 0, 'background');

        background.setOrigin(0, 0);
        background.setDepth(-10);
        background.setDisplaySize(width, height);
        background.setTexture('grass'); // 텍스처 설정

        this.towers = this.add.group();
        this.projectiles = this.add.group();
        this.enemys = this.add.group();
        this.zones = this.add.group();

        new DecoTile(this, 0, 1, 'dirty05');
        new DecoTile(this, 1, 1, 'dirty01');
        new DecoTile(this, 2, 1, 'dirty01');
        new DecoTile(this, 3, 1, 'dirty01');
        new DecoTile(this, 4, 1, 'dirty01');
        new DecoTile(this, 5, 1, 'dirty01');
        new DecoTile(this, 6, 1, 'dirty01');
        new DecoTile(this, 7, 1, 'dirty01');
        new DecoTile(this, 8, 1, 'dirty01');
        new DecoTile(this, 9, 1, 'dirty01');
        new DecoTile(this, 10, 1, 'dirty06');
        new DecoTile(this, 10, 2, 'dirty03');
        new DecoTile(this, 10, 3, 'dirty03');
        new DecoTile(this, 10, 4, 'dirty03');
        new DecoTile(this, 10, 5, 'dirty03');
        new DecoTile(this, 0, 2, 'dirty03');
        new DecoTile(this, 0, 3, 'dirty03');
        new DecoTile(this, 0, 4, 'dirty03');
        new DecoTile(this, 0, 5, 'dirty03');
        new DecoTile(this, 0, 6, 'dirty04');
        new DecoTile(this, 1, 6, 'dirty01');
        new DecoTile(this, 2, 6, 'dirty01');
        new DecoTile(this, 3, 6, 'dirty01');
        new DecoTile(this, 4, 6, 'dirty01');
        new DecoTile(this, 5, 6, 'dirty01');
        new DecoTile(this, 6, 6, 'dirty01');
        new DecoTile(this, 7, 6, 'dirty01');
        new DecoTile(this, 8, 6, 'dirty01');
        new DecoTile(this, 9, 6, 'dirty01');
        new DecoTile(this, 10, 6, 'dirty02');

        new DecoTile(this, 2, 3, 'grass01', false);
        new DecoTile(this, 6, 4, 'grass06', false);
        new DecoTile(this, 4, 3, 'grass02', false);
        new DecoTile(this, 5, 3, 'grass05', false);
        new DecoTile(this, 3, 3, 'grass01', false);
        new DecoTile(this, 5, 4, 'grass02', false);
        new DecoTile(this, 7, 3, 'grass03', false);
        new DecoTile(this, 6, 6, 'grass04', false);

        for (let i = 2; i <= 5; i++) {
            for (let j = 1; j <= 9; j++) {
                this.zones.add(new ZoneTile(this, j, i));
            }
        }

        this.topArea = this.add.zone(0, 0, width, this.game.tile.width);
        this.topArea.setOrigin(0, 0);
        this.physics.add.existing(this.topArea);
        this.topArea.body.allowGravity = false;
        this.topArea.body.immovable = true;
        this.physics.add.collider(this.enemys, this.topArea);
        this.physics.add.collider(this.projectiles, this.topArea, (projectile) => projectile.destroy());

        this.add.graphics().fillStyle('0x000000', 1).fillRect(0, 0, width, this.game.tile.width);

        this.bottomArea = this.add.zone(0, this.game.tile.height * 7, width, this.game.tile.height * 4);
        this.bottomArea.setOrigin(0, 0);
        this.physics.add.existing(this.bottomArea);
        this.bottomArea.body.allowGravity = false;
        this.bottomArea.body.immovable = true;
        this.physics.add.collider(this.enemys, this.bottomArea);
        this.physics.add.collider(this.projectiles, this.bottomArea, (projectile) => projectile.destroy());
        this.add
            .graphics()
            .fillStyle('0x000000', 1)
            .fillRect(0, this.game.tile.height * 7, width, this.game.tile.height * 4);

        this.towers.runChildUpdate = true;
        this.projectiles.runChildUpdate = true;
        this.enemys.runChildUpdate = true;

        this.towerUI = new TowerUI(this, 0, 0);

        this.goldText = this.add.text(10, 10, `${this.gold} Gold`);
        this.spawnCountText = this.add.text(10, 20 + this.goldText.y, `${this.level + 1} Wave`);
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

                            if (target.hp <= 0) {
                                projectile.parent.killCount += 1;
                                target.die(); // 적이 죽었을 때 처리
                            }
                        }
                    });
                } else {
                    // 일반적인 프로젝타일 처리
                    projectile.parent.killCount += 1;
                    enemy.hit(projectile);
                    enemy.hp -= projectile.damage;

                    if (enemy.hp <= 0) {
                        projectile.parent.closestObject = null;
                        enemy.die();
                    }
                }
            }
        });

        this.spwanWave();
    }

    spwanWave() {
        let waveEnemy = 1;
        this.enemys.add(new Enemy(this, 0, 0, { level: this.level }));
        this.spwanTimer = setInterval(() => {
            if (waveEnemy < 50) {
                waveEnemy += 1;
                this.enemys.add(new Enemy(this, 0, 0, { level: this.level }));
            } else {
                clearInterval(this.spwanTimer);
                this.waveTimer = setTimeout(() => {
                    this.level += 1;
                    this.spwanWave();
                }, 10000);
            }
        }, 750);
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
