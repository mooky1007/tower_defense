import Projectile from './Projectile.js';

class Tower extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'tower');
        this.name = 'tower';

        this.setDepth(y);

        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;

        this.level = 0;
        this.range = 200;
        this.attackDamage = 5;
        this.attackDelay = 1000;
        this.projectileSpeed = 200;
        this.closestObject = null;
        this.killCount = 0;

        this.maximumProjectileSpeed = 1000;

        this.init();
    }

    init() {
        this.setOrigin(0.5, 0.5);
        this.setInteractive();
        this.scene.add.existing(this);

        this.scene.towers.add(this);
        this.setScale(0.4);

        this.circle = this.scene.add.graphics();
        this.circle.lineStyle(2, 0xff0000, 0.5);
        this.circle.strokeCircle(this.x, this.y, this.range);
        this.circle.setDepth(-1);
        this.circle.setVisible(false);

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

        this.on('pointerdown', function (pointer) {
            if (this.scene.gold < this.level * 100 + 100) return;

            this.scene.gold -= this.level * 100 + 100;
            this.level += 1;
            this.range += 10;
            this.attackDamage += 5;
            this.projectileSpeed += 50;
            if (this.maximumProjectileSpeed < this.projectileSpeed) {
                this.projectileSpeed = this.maximumProjectileSpeed;
            }
        });

        this.on(
            'pointerover',
            function (pointer) {
                if (!this.circle.visible) {
                    this.circle.setVisible(true);
                }
            },
            this
        );

        this.on(
            'pointerout',
            function (pointer) {
                if (this.circle.visible) {
                    this.circle.setVisible(false);
                }
            },
            this
        );

        // Timer 이벤트를 사용하여 주기적으로 적을 공격
        this.attackTimer = this.scene.time.addEvent({
            delay: this.attackDelay,
            callback: this.attack,
            callbackScope: this,
            loop: true,
        });
    }

    attack() {
        if (this.closestObject) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.closestObject.x, this.closestObject.y);

            const projectile = new Projectile(this.scene, this.x, this.y);
            projectile.parent = this;
            projectile.damage = this.attackDamage;
            projectile.fire(this.x, this.y, angle, this.projectileSpeed);
        }
    }

    update() {
        this.circle.clear(); // clear previous circle
        this.circle.lineStyle(2, 0xff0000, 0.5);
        this.circle.strokeCircle(this.x, this.y, this.range);

        this.text.setText(this.level);
        this.killCountText.setText(this.killCount);

        // 적 그룹 필터링 최적화
        const enemies = this.scene.enemys.getChildren(); // assuming 'enemys' is a group

        let minDistance = this.range;
        this.closestObject = null;

        for (const enemy of enemies) {
            if (enemy.name === 'enemy') {
                const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);

                if (distance < minDistance) {
                    minDistance = distance;
                    this.closestObject = enemy;
                }
            }
        }
    }
}

export default Tower;
