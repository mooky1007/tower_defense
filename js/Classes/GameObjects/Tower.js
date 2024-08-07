import Projectile from './Projectile.js';

class Tower extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'tower');
        this.name = 'tower';
        this.setTowerData();
        this.attackTimer = null;

        this.anims.create({
            key: 'install',
            frames: this.anims.generateFrameNumbers('tower', { start: 0, end: 3 }),
            frameRate: 1,
        });

        this.anims.play('install')

        this.init();
    }

    setTowerData() {
        this.level = 0;
        this.range = 1000;
        this.radius = 30;
        this.attackDamage = 20;
        this.attackDelay = 500;
        this.projectileSpeed = 250;
        this.closestObject = null;
        this.killCount = 0;

        this.maximumProjectileSpeed = 3000;
    }

    init() {
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;

        this.setOrigin(0.5, 0.5);
        this.setDepth(this.y);
        // this.setSize(this.scene.game.tile.width, this.scene.game.tile.height);

        this.setInteractive();

        this.scene.towers.add(this);
        this.scene.add.existing(this);

        this.rangeArea = new RangeCircle(this.scene, this.x, this.y, this);

        this.text = this.scene.add.text(this.x, this.y, this.level, { color: '#fff', fontSize: '17px' });
        this.text.setOrigin(0.5, 0.5);
        this.text.setDepth(this.depth + 1);
        this.text.setStroke('x0000000', 4);

        this.killCountText = this.scene.add.text(this.x, this.y + this.text.height, this.killCount, {
            color: '#fff',
            fontSize: '17px',
        });
        this.killCountText.setOrigin(0.5, 0.5);
        this.killCountText.setDepth(this.depth + 1);
        this.killCountText.setStroke('x0000000', 4);

        this.on('pointerdown', (pointer) => this.levelUp());

        this.on(
            'pointerover',
            function (pointer) {
                if (!this.rangeArea.circle.visible) {
                    this.rangeArea.circle.setVisible(true);
                }
            },
            this
        );

        this.on(
            'pointerout',
            function (pointer) {
                if (this.rangeArea.circle.visible) {
                    this.rangeArea.circle.setVisible(false);
                }
            },
            this
        );
    }

    update() {
        this.rangeArea.update();
        this.text.setText(this.level);
        this.killCountText.setText(this.killCount);

        this.attack();
    }

    attack() {
        if (!this.attackTimer && this.closestObject) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.closestObject.x, this.closestObject.y);

            const projectile = new Projectile(this.scene, this.x, this.y, this.closestObject);
            projectile.parent = this;
            projectile.damage = this.attackDamage;
            projectile.radius = this.radius;
            projectile.fire(this.x, this.y, angle, this.projectileSpeed);

            this.attackTimer = setTimeout(() => {
                this.attackTimer = null;
            }, this.attackDelay);
        }
    }

    levelUp() {
        if (this.scene.gold < this.level * 100 + 100) return;

        this.scene.gold -= this.level * 100 + 100;
        this.level += 1;
        this.range += 10;
        this.radius += 5;
        this.attackDamage += 5;
        this.projectileSpeed += 50;
        if (this.maximumProjectileSpeed < this.projectileSpeed) {
            this.projectileSpeed = this.maximumProjectileSpeed;
        }

        this.rangeArea.setSize(this.range * 2, this.range * 2);
        this.rangeArea.body.setCircle(this.range);
    }
}

class RangeCircle extends Phaser.GameObjects.Zone {
    constructor(scene, x, y, parent) {
        super(scene, x, y, parent.range * 2, parent.range * 2);
        this.setOrigin(0.5, 0.5);
        this.setInteractive();
        this.parent = parent;
        this.radius = parent.range;

        this.enemiesInRange = new Set();

        scene.physics.add.existing(this);

        this.body.setCircle(parent.range);
        this.body.allowGravity = false;

        this.scene.physics.add.overlap(this.scene.enemys, this, (enemy, range) => {
            if (!this.enemiesInRange.has(enemy)) {
                this.enemiesInRange.add(enemy);
                // enemy.setTint(0xff0000, 0.1);

                if (this.enemiesInRange.size !== 0) {
                    this.enemiesInRange.forEach((enemy) => {
                        if (this.parent.closestObject === null) this.parent.closestObject = enemy;
                    });
                } else {
                    this.parent.closestObject = null;
                }
            }
        });

        this.circle = this.scene.add.graphics();
        this.circle.setDepth(-1);
        this.circle.setVisible(false);
    }

    update() {
        this.circle.clear(); // clear previous circle
        this.circle.lineStyle(2, 0xff0000, 0.5);
        this.circle.strokeCircle(this.x, this.y, this.parent.range);

        for (const enemy of this.enemiesInRange) {
            if (!enemy.alive) this.enemiesInRange.delete(enemy);

            const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (distance > this.radius) {
                this.enemiesInRange.delete(enemy);
                // enemy.clearTint();
            }
        }

        if (this.enemiesInRange.size === 0) {
            this.parent.closestObject = null;
        }
    }
}

export default Tower;
