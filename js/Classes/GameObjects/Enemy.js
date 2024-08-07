class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x = 0, y = 0, config) {
        super(scene, x, y, 'slime');
        this.name = 'enemy';
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.alive = true;

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1, // 무한 반복을 의미
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'slime', frame: 0 }],
            frameRate: 5,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('slime_death', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1,
        });

        this.setSize(this.scene.game.tile.width, this.scene.game.tile.height)
        this.setPosition(0, this.scene.game.tile.height + this.scene.game.tile.height / 2);
        this.setDepth(-1);
        this.level = config.level || 0;
        this.speed = (config.speed || 100) + this.level * 10;
        this.hp = (config.hp || 5) + this.level * 5;
        this.originHp = this.hp;
        this.gold = (config.gold || 10) + this.level * 5;

        this.init();
    }

    init() {
        this.setOrigin(0.5, 0.5);
        this.scene.add.existing(this);
        this.scene.enemys.add(this);

        this.anims.play('right');

        this.setCollideWorldBounds(true);
        this.body.velocity.set(this.speed, 0);

        this.hpBar = this.scene.add.graphics();
        this.hpBar.fillStyle(0xff0000, 1);
        this.hpBar.fillRect(0, 0, this.width, 3);
        this.hpBar.setPosition(this.x - this.width / 2, this.y + this.height / 2);
        this.hpBar.setDepth(1);
    }

    update() {
        if (this.alive) {
            this.hpBar.setPosition(this.x - this.width / 2, this.y + this.height / 2);
            if (this.body.blocked.right) {
                this.anims.play('left');
                this.body.velocity.y = this.speed; // turn left
            } else if (this.body.blocked.left) {
                this.anims.play('right');
                this.body.velocity.y = -this.speed; // turn right
            } else if (this.body.blocked.down) {
                this.anims.play('left');
                this.body.velocity.x = -this.speed; // turn right
            } else if (this.body.blocked.up) {
                this.anims.play('right');
                this.body.velocity.x = this.speed; // turn right
            }
        }
    }

    hit(projectile) {
        this.scene.tweens.add({
            targets: this,
            tint: 0xff0000,
            duration: 100,
            onComplete: () => {
                this.clearTint();
                projectile.destroy();
            },
        });

        this.damageText = this.scene.add.text(this.x, this.y, projectile.damage);
        this.damageText.setOrigin(0.5, 1);
        this.damageText.setStroke('x0000000', 4);

        this.scene.tweens.add({
            targets: this.damageText,
            alpha: 0,
            y: this.damageText.y - 12,
            duration: 400, // 반짝이는 시간
            onComplete: () => {
                // 애니메이션이 완료된 후 실행할 콜백 함수
                this.damageText.destroy();
                this.hpBar.clear();
                this.hpBar.fillRect(0, 0, this.width * (this.hp / this.originHp), 3);
            },
        });
    }

    die() {
        this.alive = false;
        this.setVelocity(0);
        this.hpBar.destroy();

        this.anims.play('die');

        this.scene.tweens.add({
            targets: this,
            tint: 0xff0000,
            duration: 200, // 반짝이는 시간
        });

        this.scene.gold += this.gold;
        this.destroy();
    }
}

export default Enemy;
