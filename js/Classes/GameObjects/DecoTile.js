import Tower from './Tower.js';

class DecoTile extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, ds = true) {
        super(scene, scene.game.tile.width * x, scene.game.tile.height * y, texture);

        if (ds) {
            this.setDisplaySize(scene.game.tile.width, scene.game.tile.height);
        } else {
            this.setSize(scene.game.tile.width, scene.game.tile.height);

            const ranX = scene.game.tile.width / 2 + Math.floor((Math.random() * scene.game.tile.width) / 2) * (Math.random() < 0.5 ? 1 : -1);
            const ranY = scene.game.tile.height / 2 + Math.floor((Math.random() * scene.game.tile.height) / 2) * (Math.random() < 0.5 ? 1 : -1);

            this.setPosition(this.x + ranX, this.y + ranY);
        }
        this.setOrigin(0, 0);
        this.setDepth(-9);
        scene.add.existing(this);
    }
}

export default DecoTile;
