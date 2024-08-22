class DecoTile extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, ds = true) {
        super(scene, scene.game.tile.width * x, scene.game.tile.height * y, texture);

        this.setDisplaySize(scene.game.tile.width, scene.game.tile.height);

        this.setOrigin(0, 0);
        this.setDepth(-9);

        this.setInteractive();
        this.on('pointerdown', () => {
            scene.selectedZone = null;
        });

        scene.add.existing(this);
    }
}

export default DecoTile;
