class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, target, type) {
        super(scene, x, y, 'projectile');
        this.name = 'projectile';
        this.scene.physics.world.enable(this);

        this.type = type;

        this.body.allowGravity = false;
        this.direction = new Phaser.Math.Vector2();

        this.target = target;
        this.init();
    }

    init() {
        this.setOrigin(0.5, 0.5);
        this.scene.add.existing(this);
        this.scene.projectiles.add(this);

        this.setCollideWorldBounds(true);

        this.explosionGraphics = this.scene.add.graphics();

        this.body.onWorldBounds = true;
        this.body.world.on('worldbounds', (e) => {
            if (e.gameObject.name === 'projectile' && e.gameObject === this) this.destroy();
        });
    }

    fire(x, y, angle, speed) {
        this.setPosition(x, y);

        const radians = Phaser.Math.DegToRad(angle) - Math.PI / 4;
        this.setRotation(radians);
        this.speed = speed;
        this.direction.setToPolar(angle, 1);
        this.body.velocity.set(this.direction.x * speed, this.direction.y * speed);
    }

    drawExplosionRange(scene, target) {
        this.explosionGraphics.fillStyle(0xff0000, 0.1); // 색상과 투명도 설정
        this.explosionGraphics.fillCircle(target.x, target.y, this.radius); // 원 그리기
        this.explosionGraphics.setDepth(-1);

        scene.tweens.add({
            targets: this.explosionGraphics,
            alpha: 0,
            duration: 500, // 반짝이는 시간
            onComplete: () => {
                this.explosionGraphics.destroy();
            },
        });
    }

    update() {
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    }
}

export default Projectile;
