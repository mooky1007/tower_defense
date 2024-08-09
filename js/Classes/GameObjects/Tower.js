import Projectile from './Projectile.js';

class Tower extends Phaser.GameObjects.Sprite {
    constructor(type = 'normal', scene, x, y, parent) {
        super(scene, x, y, 'tower');
        this.name = 'tower';
        this.type = type;
        this.setTowerData();
        this.attackTimer = null;
        this.parent = parent;

        this.anims.create({
            key: 'install',
            frames: this.anims.generateFrameNumbers('tower', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: 0,
        });

        this.anims.play('install');
        this.on(
            'animationcomplete',
            () => {
                this.attack();
            },
            this
        );

        this.init();
    }

    setTowerData() {
        this.level = 0;
        this.range = this.scene.game.tile.width + 20;
        this.radius = this.scene.game.tile.width;
        this.attackDamage = 3;
        this.attackDelay = 500;
        this.projectileSpeed = 500;
        this.killCount = 0;

        if (this.type === 'normal') {
        }

        if (this.type === 'explosion') {
            console.log('a');
            this.attackDamage = 1;
            this.range = this.scene.game.tile.width;
            this.setTint(0xff0000, 0xffffff, 0xffffff, 0xffffff);
        }

        if (this.type === 'long') {
          console.log('a');
          this.attackDamage = 10;
          this.range = this.scene.game.tile.width * 3;
          this.setTint(0x00ff00, 0xffffff, 0xffffff, 0xffffff);
      }

      if (this.type === 'fast') {
        console.log('a');
        this.attackDamage = 1;
        this.attackDelay = 100
        this.range = this.scene.game.tile.width;
        this.setTint(0x0000ff, 0xffffff, 0xffffff, 0xffffff);
    }

        this.maximumProjectileSpeed = 3000;
    }

    init() {
        // this.scene.physics.world.enable(this);
        // this.body.allowGravity = false;

        this.setOrigin(0.5, 0.5);
        this.setDepth(this.y);
        // this.setSize(this.scene.game.tile.width, this.scene.game.tile.height);

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
    }

    update() {
        this.rangeArea.update();
        this.text.setText(this.level);
        this.killCountText.setText(this.killCount);
    }

    attack() {
        if (this.rangeArea.enemiesInRange.size !== 0) {
            const target = Array.from(this.rangeArea.enemiesInRange)[0];

            const angle = Phaser.Math.Angle.Between(this.rangeArea.x, this.rangeArea.y, target.x, target.y);

            const projectile = new Projectile(this.scene, this.rangeArea.x, this.rangeArea.y, target, this.type);
            projectile.parent = this;
            projectile.damage = this.attackDamage;
            projectile.radius = this.radius;
            projectile.fire(this.rangeArea.x, this.rangeArea.y, angle, this.projectileSpeed);
        }

        this.timerEvent = this.scene.time.delayedCall(this.attackDelay, () => this.attack());
    }

    levelUp() {
        if (this.scene.gold < this.level * 100 + 100) return;

        this.scene.gold -= this.level * 100 + 100;
        this.level += 1;
        this.range += 5;
        this.radius += 5;
        this.attackDamage += 2;
        this.attackDelay -= 5;
        this.projectileSpeed += 10;
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

        this.enemiesInRange = new Set();

        scene.physics.add.existing(this);

        this.body.setCircle(parent.range);
        this.body.allowGravity = false;

        this.scene.physics.add.overlap(this.scene.enemys, this, (enemy, range) => {
            if (!this.enemiesInRange.has(enemy)) {
                this.enemiesInRange.add(enemy);
                // enemy.setTint(0xff0000, 0.1);
            }
        });

        this.circle = this.scene.add.graphics();
        this.circle.setDepth(-1);
    }

    update() {
        this.circle.clear(); // clear previous circle
        this.circle.lineStyle(2, 0xff0000, 0.5);
        this.circle.strokeCircle(this.x, this.y, this.parent.range);

        if (this.parent.parent.state === 'selected') {
            this.circle.setVisible(true);
        } else {
            this.circle.setVisible(false);
        }

        for (const enemy of this.enemiesInRange) {
            if (!enemy.alive) this.enemiesInRange.delete(enemy);

            const distance = Phaser.Math.Distance.Between(
                this.parent.parent.x + this.scene.game.tile.width / 2,
                this.parent.parent.y + this.scene.game.tile.height / 2,
                enemy.x,
                enemy.y
            );

            if (distance > this.parent.range * 2) {
                this.enemiesInRange.delete(enemy);
                enemy.clearTint();
            }
        }
    }
}

export default Tower;
