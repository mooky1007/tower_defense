class Box extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y) {
        super(scene, x, y, 'box');
        this.name = 'box';

        this.fillStyle(0x000000, 1);
        this.fillRect(0, 0, this.scene.game.config.width / 10, this.scene.game.config.height / 10);

        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setImmovable(true);
        this.body.setSize(this.scene.game.config.width / 10, this.scene.game.config.height / 10);
        this.setDepth(-1);
        this.setPosition((this.scene.game.config.width / 10) * x, (this.scene.game.config.height / 10) * y);

        this.scene.physics.add.collider(this.scene.enemys, this);
        scene.add.existing(this);
    }
}

export default Box;
