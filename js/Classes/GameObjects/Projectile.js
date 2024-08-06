class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'projectile');
        this.name = 'projectile';
        this.scene.physics.world.enable(this);

        // this.type = 'explosion';
        // this.radius = 50;

        this.body.allowGravity = false;

        this.direction = new Phaser.Math.Vector2();

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
        this.direction.setToPolar(angle, 1);
        this.body.velocity.set(this.direction.x * speed, this.direction.y * speed);
    }

    drawExplosionRange(scene) {
        this.explosionGraphics.fillStyle(0xff0000, 0.05); // 색상과 투명도 설정
        this.explosionGraphics.fillCircle(this.x, this.y, this.radius); // 원 그리기

        scene.tweens.add({
            targets: this.explosionGraphics,
            alpha: 0,
            duration: 500, // 반짝이는 시간
            onComplete: () => {
                this.explosionGraphics.destroy();
            },
        });

    }
}

export default Projectile;
