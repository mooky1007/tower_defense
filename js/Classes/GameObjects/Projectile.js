class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'projectile');
        this.name = 'projectile';
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;

        this.direction = new Phaser.Math.Vector2();

        this.init();
    }

    init() {
        this.setOrigin(0.5, 0.5);
        this.scene.add.existing(this);
        this.scene.projectiles.add(this);

        this.setCollideWorldBounds(true);

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
}

export default Projectile;
