class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x = 0, y = 0, config) {
        super(scene, x, y, 'enemy');
        this.name = 'enemy';
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;

        this.alive = true;

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
            frameRate: 10, // 초당 프레임 수를 나타냄(초당 10프레임 설정 의미)
            repeat: -1, // 무한 반복을 의미
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'enemy', frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('enemy', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });

        // this.setSize(this.scene.game.config.width / 10, this.scene.game.config.height / 10);
        this.setDepth(-1);
        this.level = config.level || 0;
        this.speed = (config.speed || 250) + this.level * 10;
        this.hp = (config.hp || 5) + this.level * 5;
        this.gold = (config.gold || 10) + this.level * 5;

        this.init();
    }

    init() {
        this.setOrigin(0.5, 0.5);
        this.setPosition(this.scene.game.config.width / 10 + this.scene.game.config.width / 20, this.scene.game.config.height / 10 + this.scene.game.config.height / 20);
        this.scene.add.existing(this);
        this.scene.enemys.add(this);

        this.anims.play('right')

        this.setCollideWorldBounds(true);
        this.body.velocity.set(250, 0);

        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0,
        });
    }

    update() {
        if (this.alive) {
            if (this.body.blocked.right) {
                this.anims.play('left');
                this.body.velocity.y = 250; // turn left
            } else if (this.body.blocked.left) {
                this.anims.play('right');
                this.body.velocity.y = -250; // turn right
            } else if (this.body.blocked.down) {
                this.anims.play('left');
                this.body.velocity.x = -250; // turn right
            } else if (this.body.blocked.up) {
                this.anims.play('right');
                this.body.velocity.x = 250; // turn right
            }
        }
    }

    hit() {
        this.scene.tweens.add({
            targets: this,
            tint: 0xff0000,
            duration: 200, // 반짝이는 시간
            onComplete: () => {
                // 애니메이션이 완료된 후 실행할 콜백 함수
                this.clearTint(); // 애니메이션이 완료된 후 원래 색상으로 복원
            },
        });
    }

    die() {
        this.anims.play('turn');
        this.setVelocity(0);
        this.alive = false;

        this.scene.tweens.add({
            targets: this,
            tint: 0xff0000,
            duration: 200, // 반짝이는 시간
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this,
                    alpha: 0,
                    duration: 200, // 반짝이는 시간
                    onComplete: () => {
                        this.scene.gold += this.gold;
                        this.destroy();
                    },
                });
            },
        });
    }
}

export default Enemy;
